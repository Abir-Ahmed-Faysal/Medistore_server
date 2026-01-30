import { ORDER_STATUS } from "../../generated/enums";
import { prisma } from "../../lib/prisma"

const getUserOrders = async (userId: string) => {
    const orders = await prisma.order.findMany({
        where: {
            userId,
        },
        select: {
            id: true,
            createdAt: true,
            orderItems: {
                select: {
                    quantity: true,
                    medicineRef: {
                        select: {
                            price: true,
                            title: true,
                            categoryRef: {
                                select: {
                                    category_name: true,
                                },
                            },
                            reviews: {
                                select: {
                                    id: true,
                                    content: true,
                                    userRef: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    //! calculating total price for each order
    return orders.map(order => {
        const totalPrice = order.orderItems.reduce((acc, item) => {
            return acc + item.medicineRef.price.toNumber() * item.quantity;
        }, 0);

        return {
            ...order,
            totalPrice,
            orderItems: order.orderItems.map(item => ({
                ...item,
                itemTotal: item.medicineRef.price.toNumber() * item.quantity,
            })),
        };
    });
};



const getOrderDetails = async (userId: string, orderItemId: string) => {
    const orderItem = await prisma.order_item.findFirstOrThrow({
        where: {
            id: orderItemId,
            userOrderRef: {
                userId,
            },
        },
        select: {

            quantity: true,
            medicineRef: {
                select: {
                    price: true,
                    title: true, reviews: {
                        select: {
                            id: true, content: true,
                            userRef: { select: { name: true } }
                        }
                    },
                    manufacturer: true,
                    categoryRef: {
                        select: {
                            category_name: true,
                        },
                    },
                },
            },
            userOrderRef: {
                select: {
                    address: true,
                    status: true,
                    createdAt: true,
                    userRef: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    return {
        ...orderItem,
        totalPrice: Number(orderItem.medicineRef.price) * orderItem.quantity,
    };
};


const createNewOrder = async (
    userId: string,
    address: string,
    medicineId: string,
    quantity: number
) => {
    return await prisma.$transaction(async (tx) => {


        const medicine = await tx.medicine.findUniqueOrThrow({
            where: { id: medicineId },
            select: {
                id: true,
                price: true,
                stock: true,
            },
        });

        if (medicine.stock < quantity) {
            throw new Error("Insufficient stock");
        }

        // 2️⃣ Create order
        const order = await tx.order.create({
            data: {
                userId,
                address,
            },
            select: { id: true },
        });


        await tx.order_item.create({
            data: {
                orderId: order.id,
                medicineId,
                quantity,
            },
        });


        await tx.medicine.update({
            where: { id: medicineId },
            data: {
                stock: {
                    decrement: quantity,
                },
            },
        });

        return order;
    });
};



const getSellerOrders = async (sellerId: string) => {
    const orders = await prisma.order_item.findMany({
        where: {
            medicineRef: {
                sellerId: sellerId,
            },
            userOrderRef: {
                userRef: {
                    role: "USER",
                },
            },
        },
        include: {
            medicineRef: true,
            userOrderRef: {
                include: {
                    userRef: true,
                },
            },
        },
    });

    return orders;
};




const updateOrderStatus = async (
  orderId: string,
  sellerId: string,
  status: ORDER_STATUS
) => {
  const orderItem = await prisma.order_item.findFirst({
    where: {
      orderId,
      medicineRef: { sellerId },
    },
  });

  if (!orderItem) {
    throw new Error("Unauthorized order update");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
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