import { prisma } from './db/prisma';

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ping`;
    console.log('✅ Base joignable :', result);
  } catch (e) {
    console.error('❌ Erreur :', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();