/*
  Warnings:

  - You are about to drop the column `productAdditionalDataGroupPadgid` on the `products_additional_data_item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `products_additional_data_item` DROP FOREIGN KEY `products_additional_data_item_productAdditionalDataGroupPad_fkey`;

-- AlterTable
ALTER TABLE `products_additional_data_item` DROP COLUMN `productAdditionalDataGroupPadgid`;

-- AddForeignKey
ALTER TABLE `products_additional_data_item` ADD CONSTRAINT `products_additional_data_item_padgid_fkey` FOREIGN KEY (`padgid`) REFERENCES `products_additional_data_group`(`padgid`) ON DELETE RESTRICT ON UPDATE CASCADE;
