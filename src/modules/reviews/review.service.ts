import { prisma } from "../../lib/prisma";

interface CreateReviewPayload {
  medicineId: string;
  orderItemId: string;
  content: string;
  numberRating: number;
  userId: string;
}

const createReview = async (payload: CreateReviewPayload) => {
  const { medicineId, content, numberRating, userId } = payload;


  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true }
  });

  if (!medicine) {
    console.log("hit the medicine to the condition");
    throw new Error("No medicine found");
  }

  const orderItem = await prisma.order_item.findFirst({
    where: {
      medicineId,
      userOrderRef: {
        userId
      }
    },
    select: { id: true, medicineId: true }
  });

  if (!orderItem) {
    throw new Error("unable to create review")
  }

  const creteReview = await prisma.review.create({
    data: {
      content, rating: numberRating, medicineId, userId
    }
  })

  return creteReview
};



const isEligible = async (userId: string, medicineId: string) => {
  console.log("hit th eserver  for find  frrist ");

  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true }
  });

  if (!medicine) {
    console.log("hit the medicine to the condition");
    throw new Error("No medicine found");
  }

  console.log("hit th eserver  for find medicine", medicine);

  const orderItem = await prisma.order_item.findFirst({
    where: {
      medicineId,
      userOrderRef: {
        userId
      }
    },
    select: { id: true, medicineId: true }
  });

  console.log("hit th eserver  for get orderitem", orderItem);

  return orderItem;
};


export const reviewService = {
  createReview,
  isEligible
};
