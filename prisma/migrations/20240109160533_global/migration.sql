-- CreateTable
CREATE TABLE `api_tokens` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` TIMESTAMP(0) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `api_tokens_token_unique`(`token`),
    INDEX `api_tokens_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_option_groups` (
    `pcoid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pid` INTEGER UNSIGNED NULL,
    `label` VARCHAR(32) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `index_pid`(`pid`),
    PRIMARY KEY (`pcoid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_option_items` (
    `pcoiid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pcoid` INTEGER UNSIGNED NULL,
    `label` VARCHAR(32) NOT NULL,
    `value` VARCHAR(32) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `index_pcoid`(`pcoid`),
    PRIMARY KEY (`pcoiid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variant_groups` (
    `pcvid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pid` INTEGER UNSIGNED NULL,
    `sku` VARCHAR(32) NOT NULL,
    `image_url` VARCHAR(128) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `index_pid_for_variants`(`pid`),
    PRIMARY KEY (`pcvid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variant_items` (
    `pcviid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pcvid` INTEGER UNSIGNED NULL,
    `option_group_id` INTEGER NULL,
    `option_item_id` INTEGER NULL,

    INDEX `index_pcvid_for_variant_item`(`pcvid`),
    PRIMARY KEY (`pcviid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `pid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `__typename` ENUM('BASE', 'CONFIGURABLE') NULL DEFAULT 'BASE',
    `name` VARCHAR(64) NOT NULL,
    `price` FLOAT NOT NULL,
    `product_image` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`pid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `uid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(128) NOT NULL,
    `password` VARCHAR(256) NOT NULL,
    `birthday` TIMESTAMP(0) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist` (
    `wishlist_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `wishlist_token` VARCHAR(128) NOT NULL,
    `is_guest_card` BOOLEAN NOT NULL DEFAULT true,
    `user_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `wishlist_wishlist_token_key`(`wishlist_token`),
    PRIMARY KEY (`wishlist_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist_item` (
    `wishlist_item_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `wishlsit_token` VARCHAR(128) NOT NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `variant_id` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`wishlist_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `api_tokens` ADD CONSTRAINT `api_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_option_groups` ADD CONSTRAINT `product_option_groups_pid_foreign` FOREIGN KEY (`pid`) REFERENCES `products`(`pid`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_option_items` ADD CONSTRAINT `product_option_items_pcoid_foreign` FOREIGN KEY (`pcoid`) REFERENCES `product_option_groups`(`pcoid`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_variant_groups` ADD CONSTRAINT `product_variant_groups_pid_foreign` FOREIGN KEY (`pid`) REFERENCES `products`(`pid`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_variant_items` ADD CONSTRAINT `product_variant_items_pcvid_foreign` FOREIGN KEY (`pcvid`) REFERENCES `product_variant_groups`(`pcvid`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `wishlist_item` ADD CONSTRAINT `wishlist_item_wishlsit_token_fkey` FOREIGN KEY (`wishlsit_token`) REFERENCES `wishlist`(`wishlist_token`) ON DELETE CASCADE ON UPDATE CASCADE;
