import express from 'express';
import { reviewController } from './reviews.controller';
const router = express.Router();


router.post('/', reviewController.createReview);





export { router as reviewRouter };