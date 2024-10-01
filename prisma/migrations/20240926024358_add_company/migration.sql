-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "LogoImage" TEXT[],
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Revenue" INTEGER NOT NULL,
    "Employee" INTEGER NOT NULL,
    "ActualInvestAmount" INTEGER NOT NULL,
    "SimulatedInvestAmount" INTEGER NOT NULL,
    "MyChosenCount" INTEGER NOT NULL,
    "ComparedChosenCount" INTEGER NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
