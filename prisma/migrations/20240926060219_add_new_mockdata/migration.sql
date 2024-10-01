/*
  Warnings:

  - You are about to drop the column `ActualInvestAmount` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `Category` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `ComparedChosenCount` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `Employee` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `LogoImage` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `MyChosenCount` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `Revenue` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `SimulatedInvestAmount` on the `Company` table. All the data in the column will be lost.
  - Added the required column `actualInvestAmount` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comparedChosenCount` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `myChosenCount` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `simulatedInvestAmount` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "ActualInvestAmount",
DROP COLUMN "Category",
DROP COLUMN "ComparedChosenCount",
DROP COLUMN "Description",
DROP COLUMN "Employee",
DROP COLUMN "LogoImage",
DROP COLUMN "MyChosenCount",
DROP COLUMN "Name",
DROP COLUMN "Revenue",
DROP COLUMN "SimulatedInvestAmount",
ADD COLUMN     "actualInvestAmount" INTEGER NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "comparedChosenCount" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "employee" INTEGER NOT NULL,
ADD COLUMN     "logoImage" TEXT[],
ADD COLUMN     "myChosenCount" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "revenue" INTEGER NOT NULL,
ADD COLUMN     "simulatedInvestAmount" INTEGER NOT NULL;
