-- AlterTable
ALTER TABLE `products` ADD COLUMN `description` VARCHAR(512) NULL;

-- CreateTable
CREATE TABLE `products_additional_data_group` (
    `padgid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pid` INTEGER UNSIGNED NOT NULL,
    `label` VARCHAR(32) NOT NULL,

    INDEX `index_pid_for_additional_data`(`pid`),
    PRIMARY KEY (`padgid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productAdditionalDataItem` (
    `padiid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `padgid` INTEGER UNSIGNED NOT NULL,
    `label` VARCHAR(32) NOT NULL,
    `feature` VARCHAR(64) NOT NULL,
    `productAdditionalDataGroupPadgid` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`padiid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products_additional_data_group` ADD CONSTRAINT `product_additional_groups_pid_foregin` FOREIGN KEY (`pid`) REFERENCES `products`(`pid`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productAdditionalDataItem` ADD CONSTRAINT `productAdditionalDataItem_productAdditionalDataGroupPadgid_fkey` FOREIGN KEY (`productAdditionalDataGroupPadgid`) REFERENCES `products_additional_data_group`(`padgid`) ON DELETE SET NULL ON UPDATE CASCADE;
