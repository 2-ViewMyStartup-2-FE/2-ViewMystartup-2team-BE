import { PrismaClient } from "@prisma/client";
import { COMPANIES, INVESTMENTS } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 목 데이터 삭제
  await prisma.company.deleteMany();
  await prisma.investment.deleteMany();
  // 목 데이터 추가
  await prisma.company.createMany({
    data: COMPANIES,
    skipDuplicates: true
  });
  await prisma.investment.createMany({
    data: INVESTMENTS,
    skipDuplicates: true
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
