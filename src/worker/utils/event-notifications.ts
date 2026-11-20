import type { FcmConfig } from '../fcm';
import { logger } from '../logger';
import { createNotification, sendToMany } from './notification';

const eventData = (eventId: string) => ({ eventId, route: `/events/${eventId}` });

function formatEventWhen(value: string): string {
  const trimmed = value.trim();
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return trimmed;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  }
  return date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export type EventChangeNotice = {
  startChanged: boolean;
  endChanged: boolean;
  venueChanged: boolean;
  modeChanged: boolean;
  accessChanged: boolean;
  startDate?: string | null;
  endDate?: string | null;
  venue?: string | null;
  mode?: string | null;
};

function eventUpdateBody(name: string, change: EventChangeNotice): string {
  const quoted = `"${name}"`;
  const start = change.startDate ? formatEventWhen(String(change.startDate)) : null;
  const end = change.endDate ? formatEventWhen(String(change.endDate)) : null;
  const venue = change.venue?.trim();
  if (change.startChanged && change.venueChanged && start && venue) {
    return `${quoted} now starts ${start} at ${venue}.`;
  }
  if (change.startChanged && change.endChanged && start && end) {
    return `${quoted} now starts ${start} and ends ${end}.`;
  }
  if (change.startChanged && start) return `${quoted} now starts ${start}.`;
  if (change.endChanged && end) return `${quoted} now ends ${end}.`;
  if (change.venueChanged && venue) return `${quoted} is now at ${venue}.`;
  if (change.venueChanged) return `${quoted} location was updated. Tap for details.`;
  if (change.modeChanged && change.mode) return `${quoted} is now ${change.mode}.`;
  return `Registration for ${quoted} changed. Open the event for details.`;
}

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

/** Members of a club the user already joined, except the person who created the event. */
export async function notifyClubMembersOfEvent(prisma: any, fcm: FcmConfig, event: { id: string; name: string; clubId: string; clubName: string; creatorId: string }) {
  try {
    const rows = await prisma.userClubMembership.findMany({ where: { clubId: event.clubId }, select: { userId: true } });
    const userIds = [...new Set<string>(rows.map((row: { userId: string }) => row.userId))].filter((id) => id && id !== event.creatorId);
    await sendToMany(prisma, fcm, {
      userIds,
      type: 'club_event',
      push: true,
      message: {
        title: `New from ${event.clubName}`,
        body: `${event.clubName} is hosting ${event.name}.`,
        data: eventData(event.id),
      },
    });
  } catch (error: any) { logger.error('Club event notification failed', { error: error.message, eventId: event.id }); }
}

export async function notifyEventDecision(prisma: any, fcm: FcmConfig, eventId: string, name: string, userId: string, accepted: boolean) {
  await createNotification(prisma, fcm, {
    userId,
    type: 'event_approval',
    title: accepted ? "You're in!" : 'Registration declined',
    body: accepted ? `Your ticket for "${name}" is ready.` : `Your registration for "${name}" was not approved.`,
    data: accepted ? { eventId, route: `/ticket/${eventId}` } : eventData(eventId),
    push: true,
  });
}

export async function notifyEventChanges(prisma: any, fcm: FcmConfig, eventId: string, name: string, change: EventChangeNotice) {
  try {
    const rows = await prisma.userEvents.findMany({ where: { eventId }, select: { userId: true } });
    const userIds = [...new Set<string>(rows.map((row: { userId: string }) => row.userId))];
    await sendToMany(prisma, fcm, {
      userIds,
      type: 'event_update',
      push: true,
      message: { title: 'Event update', body: eventUpdateBody(name, change), data: eventData(eventId) },
    });
  } catch (error: any) { logger.error('Event update notification failed', { error: error.message, eventId }); }
}

/** Attendee ids must be captured before the event's registration rows are deleted. */
export async function notifyEventCancelled(prisma: any, fcm: FcmConfig, event: { id: string; name: string; userIds: string[] }) {
  try {
    const userIds = [...new Set(event.userIds.filter((id) => !!id))];
    await sendToMany(prisma, fcm, {
      userIds,
      type: 'event_cancelled',
      push: true,
      message: {
        title: 'Event cancelled',
        body: `"${event.name}" has been cancelled. Tap for details.`,
        data: eventData(event.id),
      },
    });
  } catch (error: any) { logger.error('Event cancellation notification failed', { error: error.message, eventId: event.id }); }
}

const clip = (value: unknown, max = 180): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function notifyEventAnnouncement(prisma: any, fcm: FcmConfig, input: { eventId: string; eventName: string; title: string; body: string; authorId: string; userIds: string[] }) {
  try {
    const userIds = [...new Set(input.userIds.filter((id) => !!id && id !== input.authorId))];
    const detail = clip(input.body) || clip(input.title) || 'Open the event for the update.';
    await sendToMany(prisma, fcm, {
      userIds,
      type: 'event_announcement',
      push: true,
      message: {
        title: `Update for ${input.eventName}`,
        body: detail,
        data: eventData(input.eventId),
      },
    });
  } catch (error: any) { logger.error('Event announcement notification failed', { error: error.message, eventId: input.eventId }); }
}

export async function notifyClubAnnouncement(prisma: any, fcm: FcmConfig, input: { clubId: string; clubName: string; body: string; authorId: string; userIds: string[] }) {
  try {
    const userIds = [...new Set(input.userIds.filter((id) => !!id && id !== input.authorId))];
    await sendToMany(prisma, fcm, {
      userIds,
      type: 'club_announcement',
      push: true,
      message: {
        title: input.clubName,
        body: clip(input.body) || 'New club announcement.',
        data: { clubId: input.clubId, route: `/clubs/${input.clubId}` },
      },
    });
  } catch (error: any) { logger.error('Club announcement notification failed', { error: error.message, clubId: input.clubId }); }
}

export async function notifyCheckedIn(prisma: any, fcm: FcmConfig, input: { userId: string; eventId: string; eventName: string }) {
  await createNotification(prisma, fcm, {
    userId: input.userId,
    type: 'event_check_in',
    title: "You're checked in",
    body: `Welcome to ${input.eventName}.`,
    data: { eventId: input.eventId, route: `/ticket/${input.eventId}` },
    push: true,
  });
}

/** People who follow the attendee. Pending registrations wait until approval. */
export async function notifyFollowersOfRegistration(prisma: any, fcm: FcmConfig, input: { userId: string; eventId: string; eventName: string }) {
  try {
    const [person, follows] = await Promise.all([
      prisma.user.findUnique({ where: { id: input.userId }, select: { name: true } }),
      prisma.follow.findMany({ where: { followingId: input.userId }, select: { followerId: true } }),
    ]);
    const name = person?.name?.trim() || 'Someone';
    const userIds = [...new Set<string>(follows.map((row: { followerId: string }) => row.followerId))].filter((id) => id && id !== input.userId);
    await sendToMany(prisma, fcm, {
      userIds,
      type: 'friend_registered',
      push: true,
      message: {
        title: `${name} is going`,
        body: `${name} registered for ${input.eventName}.`,
        data: eventData(input.eventId),
      },
    });
  } catch (error: any) { logger.error('Friend registration notification failed', { error: error.message, eventId: input.eventId }); }
}

export async function notifyTeammatesJoined(prisma: any, fcm: FcmConfig, input: { teamName: string; eventId: string; eventName: string; memberName: string; count: number; size: number; userIds: string[] }) {
  try {
    const userIds = [...new Set(input.userIds.filter(Boolean))];
    const body = input.size > 0
      ? `${input.teamName} is now ${input.count} of ${input.size} for ${input.eventName}.`
      : `${input.memberName} joined ${input.teamName} for ${input.eventName}.`;
    await sendToMany(prisma, fcm, {
      userIds,
      type: 'team_member_joined',
      push: true,
      message: {
        title: `${input.memberName} joined your team`,
        body,
        data: { eventId: input.eventId, route: `/events/${input.eventId}` },
      },
    });
  } catch (error: any) { logger.error('Team member notification failed', { error: error.message, eventId: input.eventId }); }
}

export async function notifyCoreRemoved(prisma: any, fcm: FcmConfig, input: { clubId: string; clubName: string; userIds: string[] }) {
  try {
    await sendToMany(prisma, fcm, {
      userIds: [...new Set(input.userIds.filter(Boolean))],
      type: 'core_team_removed',
      push: true,
      message: {
        title: 'Core team update',
        body: `You're no longer on ${input.clubName}'s core team.`,
        data: { clubId: input.clubId, route: `/clubs/${input.clubId}` },
      },
    });
  } catch (error: any) { logger.error('Core removal notification failed', { error: error.message, clubId: input.clubId }); }
}

export async function notifyClubDeleted(prisma: any, fcm: FcmConfig, input: { clubName: string; userIds: string[] }) {
  try {
    await sendToMany(prisma, fcm, {
      userIds: [...new Set(input.userIds.filter(Boolean))],
      type: 'club_deleted',
      push: true,
      message: {
        title: `${input.clubName} was removed`,
        body: 'Its events and announcements are gone.',
        data: { type: 'club_deleted' },
      },
    });
  } catch (error: any) { logger.error('Club deleted notification failed', { error: error.message }); }
}
