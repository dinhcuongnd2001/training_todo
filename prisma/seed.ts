const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.todo.createMany({
    data: [
      { name: 'Học ReactJs', score: '12', desc: 'Học ReactJs', status: 'CLOSE' },
      { name: 'Học NextJs', score: '12', desc: 'Học NextJs', status: 'CLOSE' },
      { name: 'Học TypeScript', score: '12', desc: 'Học TypeScript', status: 'CLOSE' },
    ],
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
