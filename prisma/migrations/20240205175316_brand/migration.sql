/*
  Warnings:

  - Added the required column `imageUrl` to the `brands` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_brandBid_fkey`;

-- AlterTable
ALTER TABLE `brands` ADD COLUMN `imageUrl` VARCHAR(256) NOT NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandBid_fkey` FOREIGN KEY (`brandBid`) REFERENCES `brands`(`bid`) ON DELETE CASCADE ON UPDATE CASCADE;
