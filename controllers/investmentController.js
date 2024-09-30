import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

export const getInvestmentList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, order = "investmentHighest" } = req.query;
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const offset = (pageNum - 1) * limitNum;

  const orderBy =
    order === "simulatedInvestHighest"
      ? { simulatedInvestAmount: "desc" }
      : order === "simulatedInvestLowest"
      ? { simulatedInvestAmount: "asc" }
      : order === "actualInvestHighest"
      ? { actualInvestAmount: "desc" }
      : order === "actualInvestLowest"
      ? { actualInvestAmount: "asc" }
      : { simulatedInvestAmount: "desc" }; // 기본값 설정

  const selectFields = {
    id: true,
    logoImage: true,
    name: true,
    description: true,
    category: true,
    simulatedInvestAmount: true,
    actualInvestAmount: true,
  };

  const totalCount = await prisma.company.count();

  const investmentList = await prisma.company.findMany({
    orderBy,
    skip: offset,
    take: limitNum,
    select: selectFields,
  });

  const serializedCompanyList = investmentList.map((company) => {
    return {
      ...company,
      simulatedInvestAmount: company.simulatedInvestAmount.toLocaleString(),
      actualInvestAmount: company.actualInvestAmount.toLocaleString(),
    };
  });

  res.send({ data: serializedCompanyList, totalCount: totalCount });
});

export const getInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (company) {
    const serializedCompany = {
      ...company,
      simulatedInvestAmount: company.simulatedInvestAmount.toLocaleString(),
      actualInvestAmount: company.actualInvestAmount.toLocaleString(),
    };

    res.send(serializedCompany);
  }
});

export const putInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { simulatedInvestAmount } = req.body;

  const company = await prisma.company.update({
    where: { id },
    data: {
      simulatedInvestAmount,
    },
  });

  res.send(company);
});