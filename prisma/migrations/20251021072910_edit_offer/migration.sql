/*
  Warnings:

  - You are about to drop the column `price` on the `offers` table. All the data in the column will be lost.
  - Added the required column `discount_amount` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_type` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `offers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `offers` DROP COLUMN `price`,
    ADD COLUMN `discount_amount` DOUBLE NOT NULL,
    ADD COLUMN `discount_type` ENUM('percentage', 'value') NOT NULL,
    ADD COLUMN `end_date` DATETIME(3) NOT NULL,
    ADD COLUMN `setup_phase` VARCHAR(191) NULL,
    ADD COLUMN `start_date` DATETIME(3) NOT NULL,
    ADD COLUMN `subscription_details` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Active';
