/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `medicine` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medicine_title_key" ON "medicine"("title");
