import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { assert } from "superstruct";
import { CreateInvestment } from "../struct.js";
import { convertInvestmentsToString } from "./contorllerHelper.js";
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

export const postInvestment = async (req, res) => {
  const { id } = req.params;
  const { investorName, amount, comment, password } = req.body;

  // amount가 없으면 에러 반환
  if (amount === undefined || amount === null) {
    return res.status(400).send({ message: "Amount is required" });
  }

  const amountBigInt = BigInt(amount);
  const investmentData = {
    investorName,
    amount: amountBigInt,
    comment,
    password,
  };

  assert(investmentData, CreateInvestment);

  const investment = await prisma.investment.create({
    data: {
      ...investmentData,
      companyId: id,
    },
  });

  await prisma.company.update({
    where: { id },
    data: {
      virtualInvestment: {
        increment: amountBigInt,
      },
    },
  });
  const [response] = convertInvestmentsToString([investment]);
  res.status(201).send(response);
};

export const patchInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, investorName, comment, password } = req.body;

  // 기존 투자 정보를 가져옵니다.
  const existingInvestment = await prisma.investment.findUnique({
    where: { id: id },
  });

  if (!existingInvestment) {
    return res.status(404).send({ message: "Investment not found" });
  }

  const amountBigInt = BigInt(amount);

  // 회사의 현재 virtualInvestment 값을 가져옵니다.
  const currentCompany = await prisma.company.findUnique({
    where: { id: existingInvestment.companyId },
    select: { virtualInvestment: true },
  });

  const newVirtualInvestment =
    currentCompany.virtualInvestment - existingInvestment.amount + amountBigInt;

  // 회사의 virtualInvestment 업데이트 (기존 금액을 차감하고 새로운 금액을 더합니다.)
  await prisma.company.update({
    where: { id: existingInvestment.companyId },
    data: {
      virtualInvestment: newVirtualInvestment,
    },
  });

  // 투자 업데이트
  const updatedInvestment = await prisma.investment.update({
    where: { id: id },
    data: {
      amount: amountBigInt,
      investorName,
      comment,
      password,
    },
  });

  // BigInt를 문자열로 변환하여 응답
  const response = {
    ...updatedInvestment,
    amount: updatedInvestment.amount.toString(), // amount를 문자열로 변환
  };

  res.send(response);
});

export const deleteInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log("Deleting investment with id:", id); // 요청 ID 로그 추가

  // 투자 정보를 가져와서 회사 ID와 투자 금액을 가져옵니다.
  const investment = await prisma.investment.findUnique({
    where: { id: id },
    select: { amount: true, companyId: true },
  });

  if (!investment) {
    return res.status(404).send({ message: "Investment not found" });
  }

  // 투자 삭제
  await prisma.investment.delete({
    where: { id: id },
  });

  // 회사의 virtualInvestment 업데이트
  await prisma.company.update({
    where: { id: investment.companyId },
    data: {
      virtualInvestment: {
        decrement: investment.amount, // 가상 투자 금액을 감소시킴
      },
    },
  });

  res.status(204).send(); // 성공적으로 삭제됨
});
