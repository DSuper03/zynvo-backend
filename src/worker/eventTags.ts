/**
 * Event tags: short free-form labels organisers add to an event
 * ("hackathon", "ai/ml", "c++"). Stored lowercase so "AI" and "ai" are the
 * same tag and filters can match exactly.
 */

export const MAX_EVENT_TAGS = 5;
export const MAX_TAG_LENGTH = 24;

/**
 * Lowercase, keep letters, combining marks (vowel signs in Hindi, Bengali, etc.),
 * numbers and a few symbols, and tidy spaces.
 */
export function normalizeTag(raw: string): string {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N} +#&.\/\-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[-.]+|[-.]+$/g, '')
    .trim();
}

export type ParsedTags = { ok: true; tags: string[] } | { ok: false; msg: string };

/**
 * Accepts an array of strings or a comma separated string. Blank tags are
 * dropped, duplicates removed (first one wins). Too many or too long is an
 * error rather than a silent cut, so the organiser sees what happened.
 */
export function parseTags(raw: unknown): ParsedTags {
  if (raw === undefined || raw === null) return { ok: true, tags: [] };

  let items: unknown[];
  if (Array.isArray(raw)) items = raw;
  else if (typeof raw === 'string') items = raw.split(',');
  else return { ok: false, msg: 'Tags must be a list of text values.' };

  const tags: string[] = [];
  for (const item of items) {
    if (typeof item !== 'string') {
      return { ok: false, msg: 'Tags must be a list of text values.' };
    }
    const tag = normalizeTag(item);
    if (!tag) continue;
    if (tag.length > MAX_TAG_LENGTH) {
      return { ok: false, msg: `Each tag can be at most ${MAX_TAG_LENGTH} characters.` };
    }
    if (!tags.includes(tag)) tags.push(tag);
  }
  if (tags.length > MAX_EVENT_TAGS) {
    return { ok: false, msg: `You can add at most ${MAX_EVENT_TAGS} tags.` };
  }
  return { ok: true, tags };
}

/** Count tag usage across events and return the most used first. */
export function countTags(
  rows: { tags?: string[] | null }[],
  limit: number
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const tag of row.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}
