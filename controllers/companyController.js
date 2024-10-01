import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

export const getCompanyList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    order = "investmentHighest",
    search = "",
  } = req.query;
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const offset = (pageNum - 1) * limitNum;

  const orderBy =
    order === "investmentHighest"
      ? { actualInvestAmount: "desc" }
      : order === "investmentLowest"
      ? { actualInvestAmount: "asc" }
      : order === "revenueHighest"
      ? { revenue: "desc" }
      : order === "revenueLowest"
      ? { revenue: "asc" }
      : order === "employeeHighest"
      ? { employee: "desc" }
      : order === "employeeLowest"
      ? { employee: "asc" }
      : { actualInvestAmount: "desc" }; // 기본값 설정

  const selectFields = {
    id: true,
    logoImage: true,
    name: true,
    description: true,
    category: true,
    revenue: true,
    employee: true,
    actualInvestAmount: true,
  };

  const totalCount = await prisma.company.count({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ],
    },
  });

  const companyList = await prisma.company.findMany({
    orderBy,
    skip: offset,
    take: limitNum,
    select: selectFields,
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ],
    },
  });

  const serializedCompanyList = companyList.map((company) => {
    return {
      ...company,
      actualInvestAmount: company.actualInvestAmount.toString(),
    };
  });

  res.send({ data: serializedCompanyList, totalCount: totalCount });
});

export const getCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (company) {
    const serializedCompany = {
      ...company,
      actualInvestAmount: company.actualInvestAmount.toString(),
      simulatedInvestAmount: company.simulatedInvestAmount.toString(),
    };
    res.send(serializedCompany);
  }
});
