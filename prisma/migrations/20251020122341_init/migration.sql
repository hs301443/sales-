/*
  Warnings:

  - Made the column `status` on table `payment_methods` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `payment_methods` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;
