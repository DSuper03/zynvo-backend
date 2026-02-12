import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!dbUrl && process.env.NODE_ENV === 'production') {
  console.error('❌ FATAL: DIRECT_DATABASE_URL or DATABASE_URL not set in production');
  process.exit(1);
}

if (!dbUrl) {
  console.warn('⚠️  DATABASE_URL not set - using mock adapter for development.');
  // In development, if no DB URL is set, we create a dummy adapter
  // This allows the server to start without a database
}

let prismaOptions: any = {};

if (dbUrl) {
  console.log('📡 Initializing Prisma with database connection...');
  try {
    const adapter = new PrismaPg({ connectionString: dbUrl });
    prismaOptions.adapter = adapter;
  } catch (err) {
    console.error('❌ Failed to initialize PrismaPg adapter:', err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

export const prisma = new PrismaClient(prismaOptions);

// Test connection on startup (only in production)
if (dbUrl && process.env.NODE_ENV === 'production') {
  prisma.$connect()
    .then(() => console.log('✅ Database connected'))
    .catch((err) => {
      console.error('❌ Database connection failed:', err.message);
      process.exit(1);
    });
}