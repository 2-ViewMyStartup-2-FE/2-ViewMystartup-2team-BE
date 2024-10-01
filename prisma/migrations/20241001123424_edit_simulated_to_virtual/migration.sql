/*
  Warnings:

  - You are about to drop the column `simulatedInvestment` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "simulatedInvestment",
ADD COLUMN     "virtualInvestment" BIGINT NOT NULL DEFAULT 0;
