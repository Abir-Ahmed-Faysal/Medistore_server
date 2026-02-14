import express from 'express';
import { orderController } from './order.controller';
import { auth } from '../../middleware/auth';


const router = express.Router();

// * user routes
router.get('/user', auth("USER"), orderController.getUserOrders);
router.get('/user/:id', auth("USER"), orderController.getOrderDetails);
router.post('/user', auth("USER"), orderController.createNewOrder);
router.patch('/user/:id/cancel', auth("USER"), orderController.updateUserOrderStatus);


// *seller routes
router.get("/seller", auth("SELLER"), orderController.getSellerOrders);
router.get("/seller/:id", auth("SELLER"), orderController.getSellerOrderDetails);
router.patch('/seller/:id', auth("SELLER"), orderController.updateOrderStatusBySeller);


// *admin routes
router.get("/admin", auth("ADMIN"), orderController.getSellerOrders);

router.get("/admin/:id", auth("ADMIN"), orderController.getSellerOrderDetails);


// {
//     "address":"satkhira,kailganj",
//     "items":[{"medicineId":"19666e95-668b-4c7c-83b3-fb8f79d4008e","quantity":4}],
//     "quantity":5
// }


export { router as orderRouter };