import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { convertBigIntToString } from "../utils/contorllerHelper.js";

const prisma = new PrismaClient();

export const getCompareList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    order = "recent",
    search = "",
    excludeId,
  } = req.query;
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const offset = (pageNum - 1) * limitNum;

  const orderBy =
    order === "myCountHighest"
      ? { myChosenCount: "desc" }
      : order === "myCountLowest"
      ? { myChosenCount: "asc" }
      : order === "recent"
      ? { createdAt: "desc" }
      : { createdAt: "asc" };

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
      ...(excludeId && { id: { not: excludeId } }),
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
      ...(excludeId && { id: { not: excludeId } }),
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

export const patchMyCompare = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateCount = await prisma.company.update({
    where: { id },
    data: { myChosenCount: { increment: 1 } },
  });
  res.send(convertBigIntToString(updateCount));
});

export const patchCompanyCompare = async (req, res) => {
  const { ids } = req.params;

  const idArray = ids.split(",");

  try {
    const updatePromises = idArray.map((id) => {
      return prisma.company.update({
        where: { id },
        data: {
          comparedChosenCount: {
            increment: 1,
          },
        },
      });
    });

    await Promise.all(updatePromises);

    return res.status(201).json({ message: "Update successful for all ids" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while updating" });
  }
};
