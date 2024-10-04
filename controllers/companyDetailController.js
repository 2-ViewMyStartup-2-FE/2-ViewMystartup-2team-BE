import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { CreateInvestment, PatchInvestment } from "../struct.js";
import { convertInvestmentsToString } from "./contorllerHelper.js";

const prisma = new PrismaClient();

export const getCompanyDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const selectFields = {
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    revenue: true,
    employee: true,
    actualInvestment: true,
    virtualInvestment: true,
    createdAt: true,
    Investments: {
      select: {
        id: true,
        investorName: true,
        amount: true, // BigInt field
        comment: true,
        password: true,
        companyId: true,
      },
    },
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
      revenue: company.revenue.toString(),
      Investments: company.Investments.map((investment) => ({
        ...investment,
        amount: investment.amount.toString(), // BigInt 값을 문자열로 변환
      })),
    };

    res.send(serializedCompany);
  }
});

export const postInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { investorName, amount, comment, password } = req.body;
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
  const [response] = convertInvestmentsToString([investment]);
  res.status(201).send(response);
});

export const patchInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { investorName, amount, comment, password } = req.body;
  const amountBigInt = BigInt(amount);
  const investmentData = {
    investorName,
    amount: amountBigInt,
    comment,
    password,
  };
  assert(investmentData, PatchInvestment);
  const investment = await prisma.investment.update({
    where: { id },
    data: investmentData,
  });
  const [response] = convertInvestmentsToString([investment]);
  res.status(201).send(response);
});

export const deleteInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.investment.delete({
    where: { id },
  });
  res.sendStatus(201);
});
