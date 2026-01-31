

import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../middleware/sendRes";
import { orderService } from "./order.service";
import { ORDER_STATUS } from "../../generated/enums";


// ! user route

/**
 * PLACE ORDER
 */
export const createNewOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id: userId } = req.user as { id: string };

        const payload = req.body
        // console.log("checking pay",payload);

        const { address, items, quantity } = payload;


        if (!userId) {
            return sendResponse(res, { success: false, message: "Unauthorized" }, 401);
        }

        if (
            !address ||
            typeof address !== "string" ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return sendResponse(res, { success: false, message: "Invalid input data" }, 400);
        }

        const order = await orderService.createNewOrder(userId, address, items);

        return sendResponse(
            res,
            { success: true, message: "Order placed successfully", data: order },
            201
        );
    } catch (error) {
        next(error);
    }
};

/**
 * GET USER ORDERS
 */
export const getUserOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("hit here vvvvv");
        const { id: userId } = req.user as { id: string };

        if (!userId) {
            return sendResponse(res, { success: false, message: "Unauthorized" }, 401);
        }

        const orders = await orderService.getUserOrders(userId);
      

        return sendResponse(
            res,
            { success: true, message: "Orders fetched successfully", data: orders },
            200
        );
    } catch (error) {
        next(error);
    }
};



const getOrderDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("man hit ehr");
    try {
        const { id: userId } = req.user as { id: string };
        const { id: orderId } = req.params;
        console.log("hti the detail");

        if (!orderId || typeof orderId !== "string") {
            return sendResponse(
                res,
                { success: false, message: "Order ID is required" },
                400
            );
        }

        const order = await orderService.getOrderDetails(userId, orderId);

        return sendResponse(
            res,
            { success: true, message: "Order details fetched", data: order },
            200
        );
    } catch (error) {
        next(error);
    }
};

export const updateUserOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { id: orderId } = req.params;
        const status = "CANCELLED"

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


const getSellerOrders = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const orders = await orderService.getSellerOrders({ page, limit });

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            ...orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching orders",
        });
    }
};



const updateOrderStatusBySeller = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id: orderId } = req.params;
        const status = req.body.status as ORDER_STATUS;

        if (!orderId || !Object.values(ORDER_STATUS).includes(status)) {
            return sendResponse(res, { success: false, message: "Invalid input" }, 400);
        }

        if (status === ORDER_STATUS.CANCELLED) {
            return sendResponse(
                res,
                { success: false, message: "Seller cannot cancel orders" },
                400
            );
        }

        const updatedOrder = await orderService.updateOrderStatus(
            orderId as string,
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
    getUserOrders, getOrderDetails, createNewOrder, getSellerOrders, updateOrderStatusBySeller, updateUserOrderStatus
};