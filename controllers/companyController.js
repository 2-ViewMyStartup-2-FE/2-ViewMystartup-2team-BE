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
      ? { totalInvest: "desc" }
      : order === "investmentLowest"
      ? { totalInvest: "asc" }
      : order === "revenueHighest"
      ? { revenue: "desc" }
      : order === "revenueLowest"
      ? { revenue: "asc" }
      : order === "employeeHighest"
      ? { employee: "desc" }
      : order === "employeeLowest"
      ? { employee: "asc" }
      : { totalInvest: "desc" }; // 기본값 설정

  const selectFields = {
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    revenue: true,
    employee: true,
    totalInvest: true,
    simulatedInvest: true,
    actualInvest: true,
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
      totalInvest: (company.simulatedInvest + company.actualInvest).toString(),
      actualInvest: company.actualInvest.toString(),
      simulatedInvest: company.simulatedInvest.toString(),
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
      totalInvest: (company.simulatedInvest + company.actualInvest).toString(),
      actualInvest: company.actualInvest.toString(),
      simulatedInvest: company.simulatedInvest.toString(),
    };
    res.send(serializedCompany);
  }
});
