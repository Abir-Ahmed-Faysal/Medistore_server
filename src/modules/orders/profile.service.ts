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
                    price: true,
                    quantity: true,
                    medicineRef: {
                        select: {
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
            return acc + item.price.toNumber() * item.quantity;
        }, 0);

        return {
            ...order,
            totalPrice,
            orderItems: order.orderItems.map(item => ({
                ...item,
                itemTotal: item.price.toNumber() * item.quantity,
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
            price: true,
            quantity: true,
            medicineRef: {
                select: {

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
        totalPrice: Number(orderItem.price) * orderItem.quantity,
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
                price: medicine.price,
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
  status: ORDER_STATUS
) => {
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return updatedOrder;
};




export const orderService = {
    getUserOrders, getOrderDetails, createNewOrder, getSellerOrders ,updateOrderStatus
}