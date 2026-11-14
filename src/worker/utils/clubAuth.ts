/**
 * Club ownership helpers shared by the admin routes and core-team invites.
 */

// Returns the club if the caller is its founder (the club head), else null.
export const founderClub = async (prisma: any, userId: string, clubId: string | undefined) => {
  if (!clubId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return null;
  const club = await prisma.clubs.findUnique({ where: { id: clubId } });
  return club && club.founderEmail === user.email ? club : null;
};

export const ensureMembership = (prisma: any, userId: string, clubId: string) =>
  prisma.userClubMembership.upsert({
    where: { userId_clubId: { userId, clubId } },
    create: { userId, clubId },
    update: {},
  });
