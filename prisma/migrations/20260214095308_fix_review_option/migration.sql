/*
  Warnings:

  - You are about to drop the column `order_itemId` on the `review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_order_itemId_fkey";

-- DropIndex
DROP INDEX "review_order_itemId_idx";

-- AlterTable
ALTER TABLE "review" DROP COLUMN "order_itemId";
