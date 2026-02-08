import { prisma } from "../../lib/prisma"

const adminStatistics = async () => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    totalSellers,
    totalMedicines,
    revenue,
    topCategories,
    thisMonthRevenue
  ] = await Promise.all([
    // Total orders
    prisma.order.count(),

    // Pending orders
    prisma.order.count({
      where: {
        status: {
          in: ["PLACED", "PROCESSING"]
        }
      }
    }),

    // Completed orders
    prisma.order.count({
      where: {
        status: "DELIVERED"
      }
    }),

    // Total customers
    prisma.user.count({
      where: {
        role: "USER",
        banned: false
      }
    }),

    // Total sellers
    prisma.user.count({
      where: {
        role: "SELLER",
        banned: false
      }
    }),

    // Total medicines
    prisma.medicine.count(),

    // Total revenue
    prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        status: "DELIVERED"
      }
    }),

    // Top categories (based on medicine count)
    prisma.category.findMany({
      take: 5,
      orderBy: {
        medicines: {
          _count: "desc"
        }
      },
      select: {
        id: true,
        category_name: true,
        _count: {
          select: {
            medicines: true
          }
        }
      }
    }),

    // Last 30 days revenue
    prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        status: "DELIVERED",
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })
  ])

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    totalSellers,
    totalMedicines,
    totalRevenue: revenue._sum.totalAmount ?? 0,
    topCategories,
    thisMonthRevenue: thisMonthRevenue._sum.totalAmount ?? 0
  }
}



export const SellerStatistics = async () => {
  const [
    totalMedicine,
    totalStock,
    stockByCategory,
    pendingOrder,
    deliveredOrder,
    totalPerCategory,
  ] = await Promise.all([
    // total medicines
    prisma.medicine.count(),

    // total stock
    prisma.medicine.aggregate({
      _sum: { stock: true },
    }),

    // stock group by category
    prisma.medicine.groupBy({
      by: ["categoryId"],
      _sum: { stock: true },
    }),

    // pending orders
    prisma.order.count({
      where: { status: "PLACED" },
    }),

    // delivered orders
    prisma.order.count({
      where: { status: "DELIVERED" },
    }),

    // category wise medicine count
    prisma.category.findMany({
      select: {
        id: true,
        category_name: true,
        _count: {
          select: {
            medicines: true,
          },
        },
      },
    }),
  ]);

  // format stock by category
  const formattedStockByCategory = stockByCategory.map(item => ({
    categoryId: item.categoryId,
    totalStock: item._sum.stock ?? 0,
  }));

  // ✅ REQUIRED FINAL SHAPE
  const formattedCategory = totalPerCategory.map(c => ({
    categoryId: c.id,
    categoryName: c.category_name,
    totalMedicine: c._count.medicines,
  }));

  return {
    totalMedicine,
    totalStock: totalStock._sum.stock ?? 0,
    stockByCategory: formattedStockByCategory,
    pendingOrder,
    deliveredOrder,
    totalPerCategory: formattedCategory,
  };
};




export const statisticsService = {
  adminStatistics, SellerStatistics
}
