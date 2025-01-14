/*
  Warnings:

  - You are about to drop the column `used_at` on the `otp_codes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "otp_codes" DROP COLUMN "used_at";
