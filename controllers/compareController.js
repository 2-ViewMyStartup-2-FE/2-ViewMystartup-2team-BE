import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

const convertBigIntToString = (data) => {
  if (Array.isArray(data)) {
    return data.map(convertBigIntToString);
  } else if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === "bigint" ? value.toString() : value,
      ])
    );
  }
  return data;
};

export const getCompareList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, order = "recent", search = "" } = req.query; // 기본값 수정
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const offset = (pageNum - 1) * limitNum;

  const orderBy =
    order === "recent" ? { createdAt: "desc" } : { createdAt: "asc" };

  const selectFields = {
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    virtualInvestment: true,
    actualInvestment: true,
    myChosenCount: true,
    comparedChosenCount: true,
    createdAt: true,
  };

  const investmentList = await prisma.company.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy,
    skip: offset,
    take: limitNum,
    select: selectFields,
  });

  const totalCount = await prisma.company.count({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
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

export const getCompare = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const selectFields = {
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    virtualInvestment: true,
    actualInvestment: true,
    myChosenCount: true,
    comparedChosenCount: true,
    createdAt: true,
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

export const patchMyCompare = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateCount = await prisma.company.update({
    where: { id },
    data: { myChosenCount: { increment: 1 } },
  });
  res.send(convertBigIntToString(updateCount));
});

export const patchCompanyCompare = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateCount = await prisma.company.update({
    where: { id },
    data: { comparedChosenCount: { increment: 1 } },
  });
  res.send(convertBigIntToString(updateCount));
});
