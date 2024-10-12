import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { type } from "superstruct";
import {
  convertBigIntToString,
  calReturnIndex,
  compareValues
} from "../utils/contorllerHelper.js";

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
    // skip: offset,
    // take: limitNum,
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
        company.virtualInvestment + company.actualInvestment
      ).toString(),
      actualInvestment: company.actualInvestment.toString(),
      virtualInvestment: company.virtualInvestment.toString(),
      revenue: company.revenue.toString()
    };
  });
  const orderedCompanyList = serializedCompanyList.sort((a, b) =>
    compareValues(a, b, order)
  );

  const paginatedCompanyList = orderedCompanyList.slice(
    offset,
    offset + limitNum
  );

  res.send({ data: paginatedCompanyList, totalCount: totalCount });
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
        company.virtualInvestment + company.actualInvestment
      ).toString(),
      actualInvestment: company.actualInvestment.toString(),
      virtualInvestment: company.virtualInvestment.toString(),
      revenue: company.revenue.toString()
    };
    res.send(serializedCompany);
  } else {
    return res.status(404).send({ Error: "Company not found" });
  }
});
export const getRankingNearByCompanies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { order } = req.query;
  const companies = await prisma.company.findMany();
  const companiesWithTotal = companies.map((company) => ({
    ...company,
    totalInvestment: company.actualInvestment + company.virtualInvestment
  }));
  const sortedCompanies = companiesWithTotal.sort((a, b) =>
    compareValues(a, b, order)
  );
  const rankedCompanies = sortedCompanies.map((company, index) => ({
    ...convertBigIntToString(company),
    rank: index + 1
  }));
  const rankIndex = rankedCompanies.findIndex((company) => company.id === id);
  const [startIndex, endIndex] = calReturnIndex(
    rankIndex,
    rankedCompanies.length
  );
  const returnCompanies = rankedCompanies.slice(startIndex, endIndex);
  res.send(returnCompanies);
});
