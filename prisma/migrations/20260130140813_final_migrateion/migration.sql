/*
  Warnings:

  - You are about to alter the column `price` on the `medicine` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `price` on the `order_item` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[category_name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - Made the column `banned` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'SELLER');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_orderId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_order_itemId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_userId_fkey";

-- AlterTable
ALTER TABLE "medicine" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "banned" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "category_category_name_key" ON "category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "order_userId_key" ON "order"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_order_itemId_fkey" FOREIGN KEY ("order_itemId") REFERENCES "order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
