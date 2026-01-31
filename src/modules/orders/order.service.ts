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



const getOrderDetails = async (userId: string, orderId: string) => {
    const order = await prisma.order.findFirstOrThrow({
        where: {
            id: orderId,
            userId,
        },
        include: {
            orderItems: {
                select: {
                    quantity: true,
                    medicineRef: {
                        select: {
                            price: true,
                            title: true,
                            description: true,
                            manufacturer: true,
                        },
                    },
                },
            },
        },
    });

    const totalPrice = order.orderItems.reduce((sum, item) => {
        return sum + Number(item.medicineRef.price) * item.quantity;
    }, 0);

    return {
        ...order,
        totalPrice,
    };
};














const createNewOrder = async (
    userId: string,
    address: string,
    items: { medicineId: string; quantity: number }[]
) => {


    return prisma.$transaction(async (tx) => {
        //  Fetch all medicines
        const medicineIds = items.map(i => i.medicineId);

        const medicines = await tx.medicine.findMany({
            where: { id: { in: medicineIds } },
        });

        if (medicines.length !== items.length) {
            throw new Error("Some medicines not found");
        }

        const medicineMap = new Map(
            medicines.map(m => [m.id, m])
        );

        let totalAmount = 0;

        for (const item of items) {
            const medicine = medicineMap.get(item.medicineId)!;

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



        //  Create order items 
        for (const item of items) {
            await tx.order_item.create({
                data: {
                    orderId: order.id,
                    medicineId: item.medicineId,
                    quantity: item.quantity,
                },
            });

            await tx.medicine.update({
                where: { id: item.medicineId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });



        }

        return { order, totalAmount };
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