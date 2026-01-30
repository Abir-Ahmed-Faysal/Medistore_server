/*
  Warnings:

  - Added the required column `reviews` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "order_userId_key";

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "reviews" TEXT NOT NULL;
