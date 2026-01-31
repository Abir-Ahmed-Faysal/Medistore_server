import express from 'express';
import { orderController } from './order.controller';
import { auth } from '../../middleware/auth';
import { hitApi } from '../../middleware/hitChecker';

const router = express.Router();

// * user routes
router.get('/',hitApi, auth("USER"), orderController.getUserOrders);
router.get('/:id', auth("USER"), orderController.getOrderDetails);
router.post('/', auth("USER"), orderController.createNewOrder);
router.patch('/:id/cancel', auth("USER"), orderController.updateUserOrderStatus);

// *seller routes
router.get("/", auth("SELLER"), orderController.getSellerOrders);
router.patch('/:id', auth("SELLER"), orderController.updateOrderStatusBySeller);

// *admin routes
router.get('/:id', auth("ADMIN"),);
router.patch('/:id', auth("ADMIN"),);
router.delete('/:id', auth("ADMIN"),);



// {
//     "address":"satkhira,kailganj",
//     "medicineId":"19666e95-668b-4c7c-83b3-fb8f79d4008e",
//     "quantity":5
// }


export { router as orderRouter };