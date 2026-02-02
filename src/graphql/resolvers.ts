import { prisma } from '../db/db';

export const resolvers = {
  Query: {
    users: async () => {
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
            in: emails,
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

    usersByCollege: async (_: any, { collegeName }: { collegeName: string }) => {
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
      });
    },

    emailsByCollege: async (_: any, { collegeName }: { collegeName: string }) => {
       const users = await prisma.user.findMany({
        where: { collegeName },
         select: { email: true }
        });
       return users.map(user => user.email);
   },

    verifiedUsers: async () => {
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
