import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { assert } from "superstruct";
//수정해서 사용
import { CreateExample } from "../struct.js";

const prisma = new PrismaClient();

//수정해서 사용
export const getExample = asyncHandler(async (req, res) => {
  const example = await prisma.examples.findUnique({});
  res.send(example);
});

export const createExample = asyncHandler(async (req, res) => {
  assert(req.body, CreateExample);
  const example = await prisma.examples.create({
    data: req.body,
  });
  res.send(example);
});
