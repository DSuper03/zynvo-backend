/**
 * One-off: bcrypt-hash any password still stored in plain text.
 *
 * Old accounts kept plaintext passwords and were only re-hashed when the
 * user next signed in. The worker no longer accepts plaintext matches, so
 * run this once before deploying that change:
 *
 *   npx tsx scripts/hash-plaintext-passwords.ts          # dry run, counts only
 *   npx tsx scripts/hash-plaintext-passwords.ts --apply  # writes the hashes
 *
 * Reads DIRECT_DATABASE_URL from .env. Users keep the same password; only
 * the stored form changes.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const BCRYPT_PREFIX = /^\$2[aby]\$\d{2}\$/;

async function main() {
  const url = process.env.DIRECT_DATABASE_URL;
  if (!url) throw new Error('DIRECT_DATABASE_URL is not set');
  const apply = process.argv.includes('--apply');

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    const users = await prisma.user.findMany({ select: { id: true, password: true } });
    const plaintext = users.filter((u) => u.password && !BCRYPT_PREFIX.test(u.password));
    console.log(`${users.length} users, ${plaintext.length} with a plaintext password`);
    if (!apply) {
      console.log('Dry run. Re-run with --apply to hash them.');
      return;
    }
    for (const u of plaintext) {
      await prisma.user.update({ where: { id: u.id }, data: { password: bcrypt.hashSync(u.password, 10) } });
    }
    console.log(`Hashed ${plaintext.length} passwords.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
