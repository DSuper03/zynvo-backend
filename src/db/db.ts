import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ FATAL: DIRECT_DATABASE_URL or DATABASE_URL not set');
  process.exit(1);
}

console.log('📡 Initializing Prisma with database connection...');

const adapter = new PrismaPg({ connectionString: dbUrl });
export const prisma = new PrismaClient({ adapter });

// Test connection on startup
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });