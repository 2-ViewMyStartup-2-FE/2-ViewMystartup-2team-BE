/*
  Warnings:

  - You are about to drop the column `actualInvestAmount` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `logoImage` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `simulatedInvestAmount` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "actualInvestAmount",
DROP COLUMN "logoImage",
DROP COLUMN "simulatedInvestAmount",
ADD COLUMN     "actualInvest" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "logo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "simulatedInvest" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "totalInvest" BIGINT NOT NULL DEFAULT 0;
