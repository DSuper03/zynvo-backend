import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL as string 
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as unknown as PrismaClient;