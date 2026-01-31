import { ORDER_STATUS } from "../../generated/enums";
import { prisma } from "../../lib/prisma"



interface OrderItemInput {
  medicineId: string;
  quantity: number;
}


interface GetOrdersParams {
  page?: number;
  limit?: number;
}

/**
 * CREATE ORDER
 */
export const createNewOrder = async (
  userId: string,
  address: string,
  items: OrderItemInput[]
) => {
  return prisma.$transaction(async (tx) => {
    //  Validate & fetch medicines
    const medicineIds = items.map(i => i.medicineId);

    const medicines = await tx.medicine.findMany({
      where: { id: { in: medicineIds } },
    });


    if (medicines.length !== items.length) {
      throw new Error("Some medicines not found");
    }

    const medicineMap = new Map(medicines.map(m => [m.id, m]));



    //  Calculate total & check stock
    let totalAmount = 0;

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
      }

      const medicine = medicineMap.get(item.medicineId);
      if (!medicine) {
        throw new Error("Medicine not found");
      }



      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.title}`);
      }


      totalAmount += medicine.price.toNumber() * Number(item.quantity);
    }


    const order = await tx.order.create({
      data: {
        userId,
        address,
        totalAmount,
      },
    });


    for (const item of items) {
      const updated = await tx.medicine.updateMany({
        where: {
          id: item.medicineId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (updated.count === 0) {
        throw new Error("Stock changed, please retry");
      }

      await tx.order_item.create({
        data: {
          orderId: order.id,
          medicineId: item.medicineId,
          quantity: item.quantity,
        },
      });
    }

    return order;
  });
};

/**
 * GET USER ORDERS
 */
const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      status: true,
      totalAmount: true,
      orderItems: {
        select: {
          quantity: true,
          medicineRef: {
            select: {
              title: true,
              price: true,
              manufacturer: true,
              categoryRef: {
                select: { category_name: true },
              },
            },
          },
          reviews: {
            select: {
              id: true,
              content: true,
              rating: true,
              userRef: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });
};



const getOrderDetails = async (
  userId: string,
  orderId: string
) => {
  const order = await prisma.order.findFirstOrThrow({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      address: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      orderItems: {
        select: {
          quantity: true,
          medicineRef: {
            select: {
              title: true,
              price: true,
              description: true,
              manufacturer: true,
            },
          },
        },
      },
    },
  });

  return order;
};



const getSellerOrders = async ({ page = 1, limit = 20 }: GetOrdersParams) => {
  const orders = await prisma.order.findMany({
   
    include: {
      userRef: {
        select: { id: true, name: true, email: true },
      },
      orderItems: {
        include: {
          medicineRef: {
            select: { id: true, title: true, price: true, stock: true },
          },
        },
      },
    },
  });

  console.log(orders);

  const totalOrders = await prisma.order.count();
  return {
    data: orders,
    meta: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    },
  };
};




const updateOrderStatus = async (
  orderId: string,
  status: ORDER_STATUS
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  console.log(order);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === status) {
    throw new Error("order status already updated")
  }


  if (order.status === ORDER_STATUS.CANCELLED) {

    throw new Error("Cancelled orders cannot be updated");

  }



  const data = prisma.order.update({
    where: { id: orderId },
    data: { status },
  });


  console.log(data);
  return data
};




const cancelUserOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
  });

  if (order.userId !== userId) {
    throw new Error("Unauthorized");
  }

  if (order.status !== ORDER_STATUS.PLACED) {
    throw new Error("Only placed orders can be cancelled");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUS.CANCELLED },
  });
};





export const orderService = {
  getUserOrders, getOrderDetails, createNewOrder, getSellerOrders, updateOrderStatus, cancelUserOrder
}