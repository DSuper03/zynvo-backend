import { createPrismaClient } from './db';
import type { CFEnv } from './types';
import type { FcmConfig } from './fcm';
import { logger } from './logger';
import { sendToMany } from './utils/notification';

/** A missed hourly run still sends once. Older starts stay quiet. */
const WINDOW_MS = 3 * 60 * 60 * 1000;

export function eventStartsInReminderWindow(startDate: string | null | undefined, now = Date.now()): boolean {
  if (!startDate) return false;
  const start = Date.parse(startDate);
  if (!Number.isFinite(start)) return false;
  const age = now - start;
  return age >= 0 && age <= WINDOW_MS;
}

async function organizerIds(
  prisma: any,
  event: { clubId: string | null; createdById: string | null },
): Promise<string[]> {
  const club = event.clubId
    ? await prisma.clubs.findUnique({
        where: { id: event.clubId },
        select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true },
      })
    : null;
  const emails = club
    ? [club.founderEmail, club.coremember1, club.coremember2, club.coremember3].filter(
        (email: string | null): email is string => !!email && email.toLowerCase() !== 'none',
      )
    : [];
  const managers = emails.length
    ? await prisma.user.findMany({
        where: { OR: emails.map((email) => ({ email: { equals: email, mode: 'insensitive' as const } })) },
        select: { id: true },
      })
    : [];
  const ids = new Set<string>(managers.map((row: { id: string }) => row.id));
  if (event.createdById) ids.add(event.createdById);
  return [...ids];
}

/** Once, when an event has just started and people are still waiting for approval. */
export async function remindOrganizersOfPendingApprovals(env: CFEnv): Promise<void> {
  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    const rows = await prisma.userEvents.findMany({
      where: { approvalStatus: 'pending' },
      select: {
        event: { select: { id: true, EventName: true, startDate: true, clubId: true, createdById: true } },
      },
      take: 1000,
    });
    const byEvent = new Map<string, { name: string; startDate: string; clubId: string | null; createdById: string | null; pending: number }>();
    for (const row of rows) {
      const event = row.event;
      if (!event?.id) continue;
      const current = byEvent.get(event.id);
      if (current) current.pending += 1;
      else {
        byEvent.set(event.id, {
          name: event.EventName,
          startDate: event.startDate,
          clubId: event.clubId,
          createdById: event.createdById,
          pending: 1,
        });
      }
    }

    const now = Date.now();
    const fcm: FcmConfig = {
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    };

    for (const [eventId, event] of byEvent) {
      if (!eventStartsInReminderWindow(event.startDate, now)) continue;
      try {
        const already = await prisma.notification.findFirst({
          where: {
            type: 'registration_review_reminder',
            data: { path: ['eventId'], equals: eventId },
          },
          select: { id: true },
        });
        if (already) continue;
        const userIds = await organizerIds(prisma, event);
        if (userIds.length === 0) continue;
        const n = event.pending;
        await sendToMany(prisma, fcm, {
          userIds,
          type: 'registration_review_reminder',
          push: true,
          message: {
            title: 'Still waiting',
            body: `${n} ${n === 1 ? 'person is' : 'people are'} still pending for ${event.name}.`,
            data: { eventId, route: `/events/${eventId}/queue` },
          },
        });
      } catch (error: any) {
        logger.error('Pending registration reminder skipped', { error: error.message, eventId });
      }
    }
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
