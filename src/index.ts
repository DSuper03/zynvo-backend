import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './db/db';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;

async function start() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    // optional: process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();