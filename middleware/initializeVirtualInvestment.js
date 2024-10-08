import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "./asyncHandler.js";

const prisma = new PrismaClient();

export const initializeVirtualInvestment = asyncHandler(async (req, res) => {
  // 모든 회사의 virtualInvestment를 초기화
  const companies = await prisma.company.findMany({
    select: {
      id: true,
    },
  });

  for (const company of companies) {
    const totalAmount = await prisma.investment.aggregate({
      where: { companyId: company.id },
      _sum: {
        amount: true,
      },
    });

    const virtualInvestment = totalAmount._sum.amount || 0n; // Investment가 없으면 0으로 초기화

    await prisma.company.update({
      where: { id: company.id },
      data: {
        virtualInvestment: virtualInvestment, // 초기화된 값으로 업데이트
      },
    });
  }

  // console.log("Virtual investment initialization complete.");
});
