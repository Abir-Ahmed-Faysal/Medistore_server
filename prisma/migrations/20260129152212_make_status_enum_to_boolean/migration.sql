/*
  Warnings:

  - You are about to drop the column `status` on the `user` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "status",
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT DEFAULT 'USER';

-- DropEnum
DROP TYPE "ROLE";

-- DropEnum
DROP TYPE "USER_STATUS";
