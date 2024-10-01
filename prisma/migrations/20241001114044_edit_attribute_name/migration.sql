/*
  Warnings:

  - You are about to drop the column `actualInvest` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `simulatedInvest` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `totalInvest` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "actualInvest",
DROP COLUMN "simulatedInvest",
DROP COLUMN "totalInvest",
ADD COLUMN     "actualInvestment" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "simulatedInvestment" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "totalInvestment" BIGINT NOT NULL DEFAULT 0;
