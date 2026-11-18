import type { FcmConfig } from '../fcm';
import { logger } from '../logger';
import { createNotification, sendToMany } from './notification';

const eventData = (eventId: string) => ({ eventId, route: `/events/${eventId}` });

export async function notifyCoreTeamOfEvent(prisma: any, fcm: FcmConfig, event: { id: string; name: string; clubId: string; creatorId: string }) {
  try {
    const club = await prisma.clubs.findUnique({ where: { id: event.clubId }, select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true } });
    if (!club) return;
    const emails = [club.founderEmail, club.coremember1, club.coremember2, club.coremember3]
      .filter((email): email is string => typeof email === 'string' && !!email.trim() && email.toLowerCase() !== 'none');
    if (!emails.length) return;
    const users = await prisma.user.findMany({ where: { OR: emails.map((email) => ({ email: { equals: email.trim(), mode: 'insensitive' } })) }, select: { id: true } });
    const userIds = [...new Set<string>(users.map((user: { id: string }) => user.id))].filter((id) => id !== event.creatorId);
    await sendToMany(prisma, fcm, { userIds, type: 'event_core_team', push: true, message: { title: 'New core team event', body: `${event.name} is open to your club’s core team.`, data: eventData(event.id) } });
  } catch (error: any) { logger.error('Core team event notification failed', { error: error.message, eventId: event.id }); }
}

export async function notifyEventDecision(prisma: any, fcm: FcmConfig, eventId: string, name: string, userId: string, accepted: boolean) {
  await createNotification(prisma, fcm, { userId, type: 'event_approval', title: accepted ? 'Registration approved' : 'Registration declined', body: accepted ? `Your registration for ${name} was approved.` : `Your registration for ${name} was declined.`, data: eventData(eventId), push: true });
}

export async function notifyEventChanges(prisma: any, fcm: FcmConfig, eventId: string, name: string, changes: string[]) {
  try {
    const rows = await prisma.userEvents.findMany({ where: { eventId }, select: { userId: true } });
    const userIds = [...new Set<string>(rows.map((row: { userId: string }) => row.userId))];
    await sendToMany(prisma, fcm, { userIds, type: 'event_update', push: true, message: { title: 'Event details changed', body: `${name}: ${changes.join(', ')} changed. Open the event for details.`, data: eventData(eventId) } });
  } catch (error: any) { logger.error('Event update notification failed', { error: error.message, eventId }); }
}
