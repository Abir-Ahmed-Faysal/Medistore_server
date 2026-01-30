import { prisma } from "../../lib/prisma";

interface CreateReviewPayload {
  medicineId: string;
  orderItemId: string;
  content: string;
  numberRating: number;
  userId: string;
}

const createReview = async (payload: CreateReviewPayload) => {
  const { medicineId, orderItemId, content,   numberRating, userId } = payload;

  return prisma.$transaction(async (tx) => {
    
    const orderItem = await tx.order_item.findUnique({
      where: { id: orderItemId },
      select: {
        id: true,
        medicineId: true,
        userOrderRef: {
          select: { userId: true },
        },
      },
    });

    if (!orderItem) {
      throw new Error("Order item not found");
    }

    if (orderItem.userOrderRef.userId !== userId) {
      throw new Error("You are not allowed to review this order item");
    }

    if (orderItem.medicineId !== medicineId) {
      throw new Error("Medicine does not match order item");
    }


    // 3. Create review
    return tx.review.create({
      data: {
        content,
        rating:numberRating,
        medicineId,
        userId,
        order_itemId: orderItemId,
      },
    });
  });
};

const getReviewsByMedicine = async (medicineId: string) => {
  return prisma.review.findMany({
    where: { medicineId },
    orderBy: { id: "desc" },
    include: {
      userRef: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};


const getMyReviews = async (userId: string) => {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { id: "desc" },
    include: {
      medicineRef: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

export const reviewService = {
  createReview,
  getReviewsByMedicine,
  getMyReviews,
};
