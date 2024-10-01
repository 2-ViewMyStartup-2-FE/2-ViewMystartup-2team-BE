import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

export const getInvestmentList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, order = "investmentHighest" } = req.query;
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const offset = (pageNum - 1) * limitNum;

  const orderBy =
    order === "virtualInvestHighest"
      ? { virtualInvestment: "desc" }
      : order === "virtualInvestLowest"
      ? { virtualInvestment: "asc" }
      : order === "actualInvestHighest"
      ? { actualInvestment: "desc" }
      : order === "actualInvestLowest"
      ? { actualInvestment: "asc" }
      : { virtualInvestment: "desc" }; // 기본값 설정

  const selectFields = {
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    totalInvestment: true,
    virtualInvestment: true,
    actualInvestment: true,
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
      totalInvestment: (
        company.virtualInvestment + company.actualInvestment
      ).toString(),
      virtualInvestment: company.virtualInvestment.toString(),
      actualInvestment: company.actualInvestment.toString(),
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
    totalInvestment: true,
    virtualInvestment: true,
    actualInvestment: true,
  };

  const company = await prisma.company.findUnique({
    where: { id },
    select: selectFields,
  });

  if (company) {
    const serializedCompany = {
      ...company,
      totalInvestment: (
        company.virtualInvestment + company.actualInvestment
      ).toString(),
      virtualInvestment: company.virtualInvestment.toString(),
      actualInvestment: company.actualInvestment.toString(),
    };

    res.send(serializedCompany);
  }
});

//patch 구현 필요
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
