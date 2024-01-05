/*
  Warnings:

  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `api_tokens` MODIFY `token` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `email` VARCHAR(128) NOT NULL,
    MODIFY `password` VARCHAR(256) NOT NULL,
    MODIFY `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';
