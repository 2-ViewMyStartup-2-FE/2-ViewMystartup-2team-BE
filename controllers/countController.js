import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const prisma = new PrismaClient();

export const getCountList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, order = "myCountHighest" } = req.query;
  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
  const offset = (parsedPage - 1) * parsedLimit;

  let orderBy;
  switch (order) {
    case "myCountHighest":
      orderBy = { myChosenCount: "desc" };
      break;
    case "myCountLowest":
      orderBy = { myChosenCount: "asc" };
      break;
    case "comparedHighest":
      orderBy = { comparedChosenCount: "desc" };
      break;
    case "comparedLowest":
      orderBy = { comparedChosenCount: "asc" };
      break;
  }

  const selectFields = {
    logoImage: true,
    name: true,
    description: true,
    category: true,
    myChosenCount: true,
    comparedChosenCount: true,
  };

  const countList = await prisma.company.findMany({
    orderBy,
    skip: offset,
    take: parsedLimit,
    select: selectFields,
  });
  res.send(countList);
});
