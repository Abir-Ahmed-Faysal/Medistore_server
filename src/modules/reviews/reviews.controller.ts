import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { id: userId } = req.user!;
    const { id: medicineId } = req.params;
    const { orderItemId, content, rating } = req.body;

    if (!medicineId || typeof medicineId !== "string") {
      throw new
        Error("server error")
    }

    const numberRating = Number(rating);


    const review = await reviewService.createReview({
      medicineId,
      orderItemId,
      content,
      numberRating,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};




export const isEligible = async (req: Request, res: Response, next: NextFunction) => {
  console.log("hit th econtroller");
  try {
    const { id: userId } = req.user!;
    const { id: medicineId } = req.params;

    if (!userId || typeof userId !== "string") {
      throw new Error("Id not found")
    }
    if (!medicineId || typeof medicineId !== "string") {
      throw new Error("Id not found")
    }
console.log("hit the controller to the 2nd");

    const review = await reviewService.isEligible(userId, medicineId);

console.log("hit the controller to the under the down");
    if (!review) {
      return res.status(200).json({
        success: true,
        message: "no review found",
      });
    }

    console.log("hit the controller to the under the down  check");
    return res.status(200).json({
      success: true,
      message: "get permission",
      data: review,
    });



  } catch (error) {
    next(error)
  }

}

export const reviewController = {
  createReview, isEligible
};