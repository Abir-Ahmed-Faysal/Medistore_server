

import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../middleware/sendRes";
import { orderService } from "./order.service";
import { ORDER_STATUS } from "../../generated/enums";

// ! user route
const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as { id: string };
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const orders = await orderService.getUserOrders(userId);
        if (!orders) { return sendResponse(res, { success: false, message: "No orders found" }, 404); }
        return sendResponse(res, { success: true, message: "Orders fetched successfully", data: orders }, 200);
    } catch (error) {
        next(error);
    }


}


const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as { id: string };
    const { orderId: orderItemId } = req.params;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: "User ID is required" });
    }
    if (!orderItemId || typeof orderItemId !== 'string') {
        return res.status(400).json({ message: "Order ID is required" });
    }
    try {
        const orderDetails = await orderService.getOrderDetails(userId, orderItemId);
        return sendResponse(res, { success: true, message: "Order details fetched successfully", data: orderDetails }, 200);

    } catch (error) {
        next(error);
    }
}

const createNewOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: userId } = req.user as { id: string };
        const { address,
            medicineId,
            quantity } = req.body;
        const quantityNumber = Number(quantity);
        if (!address || typeof address !== 'string' || !medicineId || typeof medicineId !== 'string' || isNaN(quantityNumber) || quantityNumber <= 0) {
            return res.status(400).json({ message: "Invalid input data" });
        }



        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: "User ID is required" });
        }

        const placeOrder = await orderService.createNewOrder(userId, address, medicineId, quantityNumber);
        if (!placeOrder) {
            return sendResponse(res, { success: false, message: "Order placement failed" }, 500);
        }

        return sendResponse(res, { success: true, message: "Order placed successfully", data: placeOrder }, 201);
    } catch (error) {
        next(error);
    }

}

export const updateUserOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { id: orderId } = req.params;
        const status = req.body.status as ORDER_STATUS;

        if (!userId || typeof userId !== "string" || !orderId || typeof orderId !== "string") {
            return sendResponse(res, { success: false, message: "Invalid request" }, 400);
        }

        if (status !== ORDER_STATUS.CANCELLED) {
            return sendResponse(
                res,
                { success: false, message: "Only CANCELLED status allowed" },
                400
            );
        }

        const updatedOrder = await orderService.cancelUserOrder(orderId, userId);

        return sendResponse(
            res,
            { success: true, message: "Order cancelled successfully", data: updatedOrder },
            200
        );
    } catch (error) {
        next(error);
    }
};

// ! seller route


const getSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: sellerId } = req.user as { id: string };

        const orders = await orderService.getSellerOrders(sellerId);
        if (!orders) {
            return sendResponse(res, { success: false, message: "No orders found" }, 404);
        }



        return sendResponse(res, { success: true, message: "Orders fetched successfully", data: orders }, 200);




    } catch (error) {
        next(error);
    }
}


const updateOrderStatusBySeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId = req.user?.id;
        const { id: orderId } = req.params;
        const status = req.body.status as ORDER_STATUS;

        if (!sellerId || !orderId) {
            return sendResponse(res, { success: false, message: "Invalid request" }, 400);
        }
        if (!orderId || typeof orderId !== 'string') {
            return sendResponse(res, { success: false, message: "Order ID is required" }, 400);
        }

        if (!Object.values(ORDER_STATUS).includes(status)) {
            return sendResponse(
                res,
                {
                    success: false,
                    message: "Invalid order status",
                    data: Object.values(ORDER_STATUS),
                },
                400
            );
        }

        if (status === ORDER_STATUS.CANCELLED) {
            throw new Error("Sellers cannot cancel orders");
        }

        const updatedOrder = await orderService.updateOrderStatus(
            orderId,
            sellerId,
            status
        );

        return sendResponse(
            res,
            { success: true, message: "Order status updated", data: updatedOrder },
            200
        );
    } catch (error) {
        next(error);
    }
};


export const orderController = {
    getUserOrders, getOrderDetails, createNewOrder, getSellerOrders, updateOrderStatusBySeller
};