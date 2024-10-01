import { PrismaClient } from "@prisma/client";
import { COMPANIES } from "./mock.js";
import { INVESTORS } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 목 데이터 삭제
  await prisma.company.deleteMany();
  await prisma.investor.deleteMany();
  // 목 데이터 추가
  await prisma.company.createMany({
    data: COMPANIES,
    skipDuplicates: true,
  });
  await prisma.investor.createMany({
    data: INVESTORS,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
