//user route

import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../middleware/sendRes";
import { orderService } from "./profile.service";
import { ORDER_STATUS } from "../../generated/enums";


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








//seller route


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



const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: orderId } = req.params;
    const { status } = req.body;

    if (!orderId||typeof orderId !== 'string'   ) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
        validStatus: Object.values(ORDER_STATUS),
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

export default updateOrderStatus;


export const orderController = {
    getUserOrders, getOrderDetails, createNewOrder, getSellerOrders
};