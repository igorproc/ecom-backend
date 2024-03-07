-- CreateTable
CREATE TABLE `product_reviews` (
    `prid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pid` INTEGER UNSIGNED NOT NULL,
    `review` VARCHAR(64) NOT NULL,
    `rate` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`prid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_pid_foregin` FOREIGN KEY (`pid`) REFERENCES `products`(`pid`) ON DELETE CASCADE ON UPDATE NO ACTION;
