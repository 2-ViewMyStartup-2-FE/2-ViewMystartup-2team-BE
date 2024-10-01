-- DropForeignKey
ALTER TABLE "Investor" DROP CONSTRAINT "Investor_companyId_fkey";

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
