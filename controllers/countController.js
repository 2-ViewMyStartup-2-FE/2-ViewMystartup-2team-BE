import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

export const getCountList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, order = "myCountHighest" } = req.query;
  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const limitNum = Number(limit) > 0 ? Number(limit) : 10;
  const offset = (pageNum - 1) * parsedLimit;

  const orderBy =
    order === "myCountHighest"
      ? { myChosenCount: "desc" }
      : order === "myCountLowest"
      ? { myChosenCount: "asc" }
      : order === "comparedHighest"
      ? { comparedChosenCount: "desc" }
      : order === "comparedLowest"
      ? { comparedChosenCount: "asc" }
      : { myChosenCount: "desc" }; // 기본값 설정

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
    take: limitNum,
    select: selectFields,
  });
  res.send(countList);
});
