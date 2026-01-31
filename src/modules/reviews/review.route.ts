import express from 'express';
import { reviewController } from './reviews.controller';
import { hitApi } from '../../middleware/hitChecker';
import { auth } from '../../middleware/auth';
const router = express.Router();


router.post('/',auth(), reviewController.createReview);

// {
//   "medicineId": "ade67970-732b-464b-97c4-a8341eff0a5c",
//   "order_ItemId": "382211aa-dcc3-463a-b5c5-096cfb9108e4",
//   "content": "This medicine worked very well. Fast delivery and good packaging.",
//   "rating": 5
// }




export { router as reviewRouter };