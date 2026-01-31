import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const { id: userId } = req.user!;
    const { medicineId, orderItemId, content, rating } = req.body;
    console.log(req.body);
    const numberRating = Number(rating);
console.log("hit here");

    const review = await reviewService.createReview({
      medicineId,
      orderItemId,
      content,
      numberRating,
      userId,
    });
console.log("hit her by under review ",review);
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};


export const reviewController = {
  createReview,
};