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
      ? { simulatedInvest: "desc" }
      : order === "simulatedInvestLowest"
      ? { simulatedInvest: "asc" }
      : order === "actualInvestHighest"
      ? { actualInvest: "desc" }
      : order === "actualInvestLowest"
      ? { actualInvest: "asc" }
      : { simulatedInvest: "desc" }; // 기본값 설정

  const selectFields = {
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    totalInvest: true,
    simulatedInvest: true,
    actualInvest: true,
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
      totalInvest: (company.simulatedInvest + company.actualInvest).toString(),
      simulatedInvest: company.simulatedInvest.toString(),
      actualInvest: company.actualInvest.toString(),
    };
  });

  res.send({ data: serializedCompanyList, totalCount: totalCount });
});

export const getInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const selectFields = {
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    totalInvest: true,
    simulatedInvest: true,
    actualInvest: true,
  };

  const company = await prisma.company.findUnique({
    where: { id },
    select: selectFields,
  });

  if (company) {
    const serializedCompany = {
      ...company,
      totalInvest: (company.simulatedInvest + company.actualInvest).toString(),
      simulatedInvest: company.simulatedInvest.toString(),
      actualInvest: company.actualInvest.toString(),
    };

    res.send(serializedCompany);
  }
});

export const patchInvestment = asyncHandler(async (req, res) => {
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
