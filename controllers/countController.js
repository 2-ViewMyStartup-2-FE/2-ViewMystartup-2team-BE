import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

export const getCountList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, order = "myCountHighest" } = req.query;
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const offset = (pageNum - 1) * limitNum;

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
    id: true,
    logo: true,
    name: true,
    description: true,
    category: true,
    myChosenCount: true,
    comparedChosenCount: true,
  };

  const totalCount = await prisma.company.count();

  const countList = await prisma.company.findMany({
    orderBy,
    // skip: offset,
    // take: limitNum,
    select: selectFields,
  });

  const rankedCountList = countList.map((company, index) => {
    return {
      ...company,
      rank: index + 1,
    };
  });

  const paginatedCountList = rankedCountList.slice(offset, offset + limitNum);

  res.send({ data: paginatedCountList, totalCount: totalCount });
});

// 밑 부분 나중에 삭제하기
export const patchMyCount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateCount = await prisma.company.update({
    where: { id },
    data: { myChosenCount: { increment: 1 } },
  });
  res.send(convertBigIntToString(updateCount));
});

export const patchComparedCount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateCount = await prisma.company.update({
    where: { id },
    data: { comparedChosenCount: { increment: 1 } },
  });
  res.send(convertBigIntToString(updateCount));
});
