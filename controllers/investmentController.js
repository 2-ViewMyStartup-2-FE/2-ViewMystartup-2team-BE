import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// export const getInvestmentList = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10, order = "investmentHighest" } = req.query;
//   const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
//   const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
//   const offset = (pageNum - 1) * limitNum;

//   const orderBy =
//     order === "amountHighest" ? { amount: "desc" } : { amount: "asc" };

//   const selectFields = {
//     id: true,
//     investorName: true,
//     amount: true,
//     comment: true,
//     password: true
//   };

//   const totalCount = await prisma.investment.count();

//   const investmentList = await prisma.investment.findMany({
//     orderBy,
//     skip: offset,
//     take: limitNum,
//     select: selectFields
//   });

//   const serializedInvestmentList = investmentList.map((investment) => {
//     return {
//       ...investment,
//       amount: investment.amount.toString()
//     };
//   });

//   res.send({ data: serializedInvestmentList, totalCount: totalCount });
// });

// export const getInvestment = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const selectFields = {
//     id: true,
//     investorName: true,
//     amount: true,
//     comment: true,
//     password: true
//   };

//   const investment = await prisma.investment.findUnique({
//     where: { id },
//     select: selectFields
//   });

//   if (investment) {
//     const serializedInvestment = {
//       ...investment,
//       amount: investment.amount.toString()
//     };

//     res.send(serializedInvestment);
//   }
// });

// //patch 구현 필요
// export const patchInvestment = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { amount } = req.body;

//   const investment = await prisma.investment.update({
//     where: { id },
//     data: {
//       amount
//     }
//   });

//   res.send(investment);
// });
