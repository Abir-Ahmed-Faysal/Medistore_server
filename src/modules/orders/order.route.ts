import express from 'express';
import { orderController } from './order.controller';
import { auth } from '../../middleware/auth';
import { hitApi } from '../../middleware/hitChecker';

const router = express.Router();

// * user routes
router.get('/user',hitApi, auth("USER"), orderController.getUserOrders);
router.get('/user/:id', auth("USER"), orderController.getOrderDetails);
router.post('/user', auth("USER"), orderController.createNewOrder);
router.patch('/user/:id/cancel', auth("USER"), orderController.updateUserOrderStatus);


// *seller routes
router.get("/seller",hitApi, auth("SELLER"), orderController.getSellerOrders);
router.patch('/seller/:id',hitApi, auth("SELLER"), orderController.updateOrderStatusBySeller);


// *admin routes
router.get('/:id', auth("ADMIN"),);
router.patch('/:id', auth("ADMIN"),);
router.delete('/:id', auth("ADMIN"),);



// {
//     "address":"satkhira,kailganj",
//     "items":[{"medicineId":"19666e95-668b-4c7c-83b3-fb8f79d4008e","quantity":4}],
//     "quantity":5
// }


export { router as orderRouter };