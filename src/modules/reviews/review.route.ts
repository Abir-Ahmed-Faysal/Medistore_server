import express from 'express';
import { reviewController } from './reviews.controller';
import { auth } from '../../middleware/auth';
import { hitApi } from '../../middleware/hitApi';
const router = express.Router();


router.get('/:id/eligibility', auth(), reviewController.isEligible);


router.post('/:id', auth("USER"), reviewController.createReview);

// {
//   "medicineId": "36383943-ac1e-4754-9c95-277caaa3acd8",
//   "content": "This medicine worked very well. Fast delivery and good packaging.",
//   "rating": 5
// }


export { router as reviewRouter };