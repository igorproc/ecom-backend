/*
  Warnings:

  - You are about to drop the `productAdditionalDataItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `productAdditionalDataItem` DROP FOREIGN KEY `productAdditionalDataItem_productAdditionalDataGroupPadgid_fkey`;

-- DropTable
DROP TABLE `productAdditionalDataItem`;

-- CreateTable
CREATE TABLE `products_additional_data_item` (
    `padiid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `padgid` INTEGER UNSIGNED NOT NULL,
    `label` VARCHAR(32) NOT NULL,
    `feature` VARCHAR(64) NOT NULL,
    `productAdditionalDataGroupPadgid` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`padiid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products_additional_data_item` ADD CONSTRAINT `products_additional_data_item_productAdditionalDataGroupPad_fkey` FOREIGN KEY (`productAdditionalDataGroupPadgid`) REFERENCES `products_additional_data_group`(`padgid`) ON DELETE SET NULL ON UPDATE CASCADE;
