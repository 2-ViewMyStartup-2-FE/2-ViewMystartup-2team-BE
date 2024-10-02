/*
  Warnings:

  - You are about to drop the column `totalInvestment` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `Investor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Investor" DROP CONSTRAINT "Investor_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "totalInvestment";

-- DropTable
DROP TABLE "Investor";

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "investorName" TEXT NOT NULL,
    "Amount" BIGINT NOT NULL,
    "comment" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
