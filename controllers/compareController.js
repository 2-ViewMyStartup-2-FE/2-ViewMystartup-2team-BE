import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

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
  const companyId = parseInt(id, 10); // ID를 정수형으로 변환
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return res.status(404).send({ message: "회사를 찾을 수 없습니다." });
  }

  // BigInt 직렬화를 위한 처리
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
  const companyId = parseInt(id, 10); // ID를 정수형으로 변환
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return res.status(404).send({ message: "회사를 찾을 수 없습니다." });
  }

  const updateCount = await prisma.company.update({
    where: { id: companyId },
    data: { myChosenCount: { increment: 1 } },
  });

  res.send(updateCount);
});

export const patchCompanyCompare = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const companyId = parseInt(id, 10); // ID를 정수형으로 변환
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return res.status(404).send({ message: "회사를 찾을 수 없습니다." });
  }

  const updateCount = await prisma.company.update({
    where: { id: companyId },
    data: { comparedChosenCount: { increment: 1 } },
  });

  res.send(updateCount);
});
