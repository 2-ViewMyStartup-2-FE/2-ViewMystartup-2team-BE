import { PrismaClient } from "@prisma/client";
import {} from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 목 데이터 추가, 수정해서 사용
  await prisma.product.createMany({
    //data: ,
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
