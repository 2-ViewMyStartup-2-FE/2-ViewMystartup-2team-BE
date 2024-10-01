import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { type } from "superstruct";

const prisma = new PrismaClient();

export const getCompanyList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    order = "investmentHighest",
    search = ""
  } = req.query;
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const offset = (pageNum - 1) * limitNum;

  // 기존 sort 함수
  // const orderBy =
  //   order === "investmentHighest"
  //     ? { totalInvestment: "desc" }
  //     : order === "investmentLowest"
  //     ? { totalInvestment: "asc" }
  //     : order === "revenueHighest"
  //     ? { revenue: "desc" }
  //     : order === "revenueLowest"
  //     ? { revenue: "asc" }
  //     : order === "employeeHighest"
  //     ? { employee: "desc" }
  //     : order === "employeeLowest"
  //     ? { employee: "asc" }
  //     : { totalInvestment: "desc" }; // 기본값 설정

  const selectFields = {
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    revenue: true,
    employee: true,
    // totalInvestment: true,
    virtualInvestment: true,
    actualInvestment: true
  };

  const totalCount = await prisma.company.count({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } }
      ]
    }
  });
  const companyList = await prisma.company.findMany({
    // orderBy,
    skip: offset,
    take: limitNum,
    select: selectFields,
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } }
      ]
    }
  });
  const serializedCompanyList = companyList.map((company) => {
    return {
      ...company,
      totalInvestment: (
        BigInt(company.virtualInvestment) + BigInt(company.actualInvestment)
      ).toString(),
      actualInvestment: company.actualInvestment.toString(),
      virtualInvestment: company.virtualInvestment.toString(),
      revenue: company.revenue.toString()
    };
  });

  // 새 sort 함수
  const orderedCompanyList = serializedCompanyList.sort((a, b) => {
    const totalA = BigInt(a.virtualInvestment) + BigInt(a.actualInvestment); // 수정된 부분
    const totalB = BigInt(b.virtualInvestment) + BigInt(b.actualInvestment);
    return;

    order === "investmentHighest"
      ? totalB - totalA
      : order === "investmentLowest"
      ? totalA - totalB
      : order === "revenueHighest"
      ? b.revenue - a.revenue
      : order === "revenueLowest"
      ? a.revenue - b.revenue
      : order === "employeeHighest"
      ? b.employee - a.employee
      : order === "employeeLowest"
      ? a.employee - b.employee
      : totalB - totalA; // 기본값
  });

  res.send({ data: orderedCompanyList, totalCount: totalCount });
});

export const getCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (company) {
    const serializedCompany = {
      ...company,
      totalInvestment: (
        BigInt(company.virtualInvestment) + BigInt(company.actualInvestment)
      ).toString(),
      actualInvestment: company.actualInvestment.toString(),
      virtualInvestment: company.virtualInvestment.toString(),
      revenue: company.revenue.toString()
    };
    res.send(serializedCompany);
  }
});
