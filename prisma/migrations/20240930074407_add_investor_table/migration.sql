-- CreateTable
CREATE TABLE "Investor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "investmentAmount" BIGINT NOT NULL DEFAULT 0,
    "comment" TEXT NOT NULL,
    "password" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
