import { PrismaClient } from "../generated/prisma";
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
  var prisma: any | undefined;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | any | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL 
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;