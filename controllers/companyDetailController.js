import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { PatchInvestment } from "../struct.js";
import { convertInvestmentsToString } from "../utils/contorllerHelper.js";

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

export const patchInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, investorName, comment, password } = req.body;

  // 기존 투자 정보를 가져옵니다.
  try {
    const amountBigInt = BigInt(amount);

    // amount는 BigInt로 전환한 후 assert로 넣기
    assert({ ...req.body, amount: amountBigInt }, PatchInvestment);

    const investment = await prisma.$transaction(async (prisma) => {
      const existingInvestment = await prisma.investment.findUnique({
        where: { id: id },
      });

      if (!existingInvestment) {
        throw new Error("Investment not found");
      }

      // 회사의 현재 virtualInvestment 값을 가져옵니다.
      const currentCompany = await prisma.company.findUnique({
        where: { id: existingInvestment.companyId },
        select: { virtualInvestment: true },
      });

      if (!currentCompany) {
        throw new Error("Company not found");
      }

      const newVirtualInvestment =
        currentCompany.virtualInvestment -
        existingInvestment.amount +
        amountBigInt;

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

      return updatedInvestment;
    });

    // BigInt를 문자열로 변환하여 응답
    const [response] = convertInvestmentsToString([investment]);

    res.status(201).send(response);
  } catch (error) {
    console.error("Error in patchInvestment:", error);

    if (
      error.message === "Investment not found" ||
      error.message === "Company not found"
    ) {
      return res.status(404).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Internal server error" });
    }
  }
});

export const deleteInvestment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.$transaction(async (prisma) => {
      // 투자 정보를 가져와서 회사 ID와 투자 금액을 가져옵니다.
      const investment = await prisma.investment.findUnique({
        where: { id: id },
        select: { amount: true, companyId: true },
      });

      if (!investment) {
        throw new Error("Investment not found");
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
    });
  } catch (error) {
    console.error("Error in deleteInvestment:", error);

    if (error.message === "Investment not found") {
      return res.status(404).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  res.sendStatus(204); // 성공적으로 삭제됨
});
