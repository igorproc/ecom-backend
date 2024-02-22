/*
  Warnings:

  - You are about to drop the column `brandBid` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_brandBid_fkey`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `brandBid`,
    ADD COLUMN `bid` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_bid_fkey` FOREIGN KEY (`bid`) REFERENCES `brands`(`bid`) ON DELETE CASCADE ON UPDATE CASCADE;
