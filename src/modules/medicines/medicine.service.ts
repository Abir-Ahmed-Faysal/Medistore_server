import { Medicine } from "../../generated/client";
import { MedicineWhereInput } from "../../generated/models"
import { normalizeSearch } from "../../helper/normalizeSearch";
import { prisma } from "../../lib/prisma"

interface AddMedicineDTO {
  image: string;
  title: string;
  description: string;
  manufacturer: string;
  convertPrice: number;
  convertStock: number;
  sellerId: string;
  categoryId: string;

}

export const adminStatics = async () => {
  const [
    totalMedicine,
    totalStock,
    totalStockByCategory,
    pendingOrder,
    deliveredOrder,
    cancelledOrders,
    totalCategories,
    medicinesWithLowStock,
  ] = await Promise.all([
    // Total medicines
    prisma.medicine.count(),

    // Total stock (sum of all medicine stock)
    prisma.medicine.aggregate({
      _sum: { stock: true },
    }),

    // Stock grouped by category
    prisma.medicine.groupBy({
      by: ["categoryId"],
      _sum: { stock: true },
    }),

    // Pending orders
    prisma.order.count({
      where: { status: "PLACED" },
    }),

    // Delivered orders
    prisma.order.count({
      where: { status: "DELIVERED" },
    }),

    // Cancelled orders
    prisma.order.count({
      where: { status: "CANCELLED" },
    }),

    // Total categories
    prisma.category.count(),

    // Low stock medicines (for alert)
    prisma.medicine.findMany({
      where: {
        stock: { lt: 10 },
      },
      select: {
        id: true,
        title: true,
        stock: true,
      },
    }),
  ]);

  // Format stock by category
  const stockByCategory = totalStockByCategory.map(item => ({
    categoryId: item.categoryId,
    stock: item._sum.stock ?? 0,
  }));

  return {
    totalMedicine,
    totalStock: totalStock._sum.stock ?? 0,
    stockByCategory,
    pendingOrder,
    deliveredOrder,
    cancelledOrders,
    totalCategories,
    lowStockMedicines: medicinesWithLowStock,
  };
};

export const sellerStatics = async () => {
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





const getAllMedicine = async ({
  search,
  category,
  minPrice,
  maxPrice,
  manufacturer,
  page,
  skip,
  limit,
}: {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  manufacturer?: string
  page: number
  skip: number
  limit: number
}) => {
  const andCondition: MedicineWhereInput[] = []


  if (search) {
    const searchTerms = normalizeSearch(search)

    andCondition.push({
      AND: searchTerms.map(term => ({
        OR: [
          {
            title: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            categoryRef: {
              category_name: {
                contains: term,
                mode: "insensitive",
              },
            },
          },
        ],
      })),
    })
  }

  // 🗂 CATEGORY
  if (category) {
    andCondition.push({
      categoryRef: {
        category_name: {
          equals: category,
          mode: "insensitive",
        },
      },
    })
  }

  // 🏭 MANUFACTURER
  if (manufacturer) {
    andCondition.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive",
      },
    })
  }

  // 💰 PRICE RANGE (optional)
  if (minPrice !== undefined || maxPrice !== undefined) {
    andCondition.push({
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    })
  }

  const whereCondition: MedicineWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {}

  const data = await prisma.medicine.findMany({
    where: whereCondition,
    skip,
    take: limit,
    include: {
      categoryRef: true,
    },
  })

  const total = await prisma.medicine.count({
    where: whereCondition,
  })

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  }
}


const getMedicine = async (id: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      categoryRef: {
        select: {
          category_name: true
        }
      }
    }
  })

  if (!medicine) {
    throw new Error("Medicine not found")
  }

  return medicine
}


const addMedicine = async ({ image, title,
  description,
  manufacturer,
  convertPrice,
  convertStock,
  sellerId,
  categoryId, }: AddMedicineDTO) => {


  const findCategory = await prisma.category.findUnique({
    where: {
      id: categoryId
    }, select: {
      id: true
    }
  })


  if (!findCategory) {
    throw new Error("category Not found")
  }



  return prisma.medicine.create({
    data: {
      image,
      title,
      description,
      manufacturer,
      price: convertPrice,
      stock: convertStock,
      sellerId,
      categoryId,
    },
    include: {
      categoryRef: { select: { category_name: true } },
    },
  })
}


const updateMedicine = async (

  id: string, sellerId: string,
  payload: Omit<Medicine, "id">
): Promise<Medicine> => {
  console.log(payload);
  const medicine = await prisma.medicine.findFirst({
    where: { id, sellerId }
  })
  if (!medicine) throw new Error("Unauthorized")

  const result = await prisma.medicine.update({
    where: { id },
    data: payload,
  });

  return result;
};

const removeMedicine = async (id: string, sellerId: string): Promise<Medicine | null> => {

  const medicine = await prisma.medicine.findUnique({
    where: { id, sellerId }, select: { id: true }
  });
  if (!medicine) { throw new Error("Medicine not found") }

  const result = await prisma.medicine.delete({
    where: { id }
  });
  return result;

}

export const medicineService = {
  getAllMedicine, getMedicine, addMedicine, updateMedicine, removeMedicine, sellerStatics,adminStatics
}