

import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../middleware/sendRes";
import { orderService } from "./order.service";
import { SellerOrderStatus } from "../../constant/orderStatus";
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



export const updateUserOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id: orderId } = req.params;
        const userId = req.user!.id;
        const status = req.body.status as ORDER_STATUS;


        if (!orderId || typeof orderId !== "string") {
            return sendResponse(res, {
                success: false,
                message: "Order ID is required",
            }, 400);
        }


        if (status !== ORDER_STATUS.CANCELLED) {
            return sendResponse(res, {
                success: false,
                message: "Only CANCELLED status is allowed",
            }, 400);
        }

        const updatedOrder = await orderService.cancelUserOrder(
            orderId,
            userId
        );

        return sendResponse(res, {
            success: true,
            message: "Order cancelled successfully",
            data: updatedOrder,
        }, 200);

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



const updateOrderStatusBySeller = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id: orderId } = req.params;
        const { status } = req.body;

        if (!orderId || typeof orderId !== 'string') {
            return res.status(400).json({
                message: "Order ID is required",
            });
        }

        if (!Object.values(SellerOrderStatus).includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
                validStatus: Object.values(SellerOrderStatus),
            });
        }

        const updatedOrder = await orderService.updateOrderStatus(
            orderId,
            status
        );

        res.status(200).json({
            message: "Order status updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        next(error);
    }
};




export const orderController = {
    getUserOrders, getOrderDetails, createNewOrder, getSellerOrders, updateOrderStatusBySeller
};