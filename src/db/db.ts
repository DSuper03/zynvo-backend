import dotenv from 'dotenv';
import path from 'path';

// Ensure dotenv is loaded before accessing env vars
if (!process.env.DIRECT_DATABASE_URL && !process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';

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
      // Don't exit immediately - let the health check fail naturally
      // This gives Cloud Run time to log the error properly
      console.error('❌ Will retry database connection...');
    }
  }
}

export const prisma = new PrismaClient(prismaOptions);

// Test connection on startup (only in production)
if (dbUrl && process.env.NODE_ENV === 'production') {
  const connectWithRetry = async (retries = 5, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await prisma.$connect();
        console.log('✅ Database connected');
        return;
      } catch (err: any) {
        console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, err.message);
        if (i < retries - 1) {
          console.log(`⏳ Retrying in ${delay / 1000}s...`);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    console.error('❌ All database connection attempts failed. Exiting.');
    process.exit(1);
  };
  connectWithRetry();
}