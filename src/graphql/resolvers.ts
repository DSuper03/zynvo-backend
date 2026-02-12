import { prisma } from '../db/db';

export const resolvers = {
  Query: {
    users: async (_: any, { limit = 50, skip = 0 }: { limit?: number; skip?: number }) => {
      // Cap limit to prevent memory exhaustion
      const safeLimit = Math.min(limit, 1000);
      const safeSkip = Math.max(skip, 0);
      
      return await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          collegeName: true,
          isVerified: true,
          clubName: true,
          createdAt: true,
        },
        take: safeLimit,
        skip: safeSkip,
      });
    },

    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          collegeName: true,
          isVerified: true,
          clubName: true,
          createdAt: true,
        },
      });
    },

    usersByEmail: async (_: any, { emails }: { emails: string[] }) => {
      return await prisma.user.findMany({
        where: {
          email: {
            in: emails.slice(0, 1000), // Cap input to prevent memory exhaustion
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          collegeName: true,
          isVerified: true,
          clubName: true,
          createdAt: true,
        },
      });
    },

    usersByCollege: async (_: any, { collegeName, limit = 100, skip = 0 }: { collegeName: string; limit?: number; skip?: number }) => {
      const safeLimit = Math.min(limit, 1000);
      const safeSkip = Math.max(skip, 0);
      
      return await prisma.user.findMany({
        where: {
          collegeName,
        },
        select: {
          id: true,
          email: true,
          name: true,
          collegeName: true,
          isVerified: true,
          clubName: true,
          createdAt: true,
        },
        take: safeLimit,
        skip: safeSkip,
      });
    },

    emailsByCollege: async (_: any, { collegeName, limit = 100, skip = 0 }: { collegeName: string; limit?: number; skip?: number }) => {
      const safeLimit = Math.min(limit, 1000);
      const safeSkip = Math.max(skip, 0);
      
      const users = await prisma.user.findMany({
        where: { collegeName },
        select: { email: true },
        take: safeLimit,
        skip: safeSkip,
      });
      return users.map(user => user.email);
    },

    verifiedUsers: async (_: any, { limit = 50, skip = 0 }: { limit?: number; skip?: number }) => {
      const safeLimit = Math.min(limit, 1000);
      const safeSkip = Math.max(skip, 0);
      
      return await prisma.user.findMany({
        where: {
          isVerified: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          collegeName: true,
          isVerified: true,
          clubName: true,
          createdAt: true,
        },
        take: safeLimit,
        skip: safeSkip,
      });
    },
  },

  Mutation: {
    updateUserVerification: async (_: any, { userId, isVerified }: { userId: string; isVerified: boolean }) => {
      return await prisma.user.update({
        where: { id: userId },
        data: { isVerified },
        select: {
          id: true,
          email: true,
          name: true,
          collegeName: true,
          isVerified: true,
          clubName: true,
          createdAt: true,
        },
      });
    },
  },
};
