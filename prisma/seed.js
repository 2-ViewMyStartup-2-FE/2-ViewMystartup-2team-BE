import { PrismaClient } from "@prisma/client";
import { COMPANIES } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 목 데이터 추가, 수정해서 사용
  await prisma.company.createMany({
    data: COMPANIES,
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
