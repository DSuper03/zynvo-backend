export const kolkataAreas = {
  beliaghata: 'Near RCCIIT',
  garia: 'Near NSEC',
  'sector-v': 'Salt Lake Sector V',
} as const;

export type KolkataArea = keyof typeof kolkataAreas;

export function isKolkataArea(value: unknown): value is KolkataArea {
  return typeof value === 'string' && Object.hasOwn(kolkataAreas, value);
}

export function campusArea(college: string | null | undefined): KolkataArea | null {
  const name = college?.toLowerCase().replace(/[^a-z0-9]+/g, ' ') ?? '';
  if (/\b(?:rcciit|rcc institute of information technology)\b/.test(name)) return 'beliaghata';
  if (/\b(?:nsec|netaji subhash engineering college)\b/.test(name)) return 'garia';
  if (/\b(?:sector v|sector 5|techno india university)\b/.test(name)) return 'sector-v';
  return null;
}

export const kolkataTopics = Object.keys(kolkataAreas).map((area) => 'kolkata_events_' + area.replace('-', '_'));
export const kolkataTopic = (area: KolkataArea) => 'kolkata_events_' + area.replace('-', '_');

const IST_OFFSET = 330 * 60_000;
export function lunchWindow(now: Date) {
  const local = new Date(now.getTime() + IST_OFFSET);
  const day = local.toISOString().slice(0, 10);
  const hour = local.getUTCHours();
  if (hour >= 14) local.setUTCDate(local.getUTCDate() + 1);
  const nextDay = local.toISOString().slice(0, 10);
  return { day, nextDay, open: hour === 13, startsAt: new Date(nextDay + 'T13:00:00+05:30') };
}
