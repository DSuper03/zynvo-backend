/**
 * College names are free text for colleges outside the built-in list (the
 * signup "Other" option), so one college arrives as "Netaji Subhash Chandra",
 * "netaji subhash chanda kolkata", " NSC  Kolkata" ... Matching here is
 * deliberately tolerant of case, spacing, small typos and an extra city/state,
 * but not of a different institution type ("... Engineering College" vs
 * "... University").
 */

/** Values that mean "no college set". */
export const PLACEHOLDER_COLLEGES = ['not joined', 'not_joined', 'zync college', 'n/a', 'na', 'none', '', 'null', 'undefined', 'other'];

/** Trim and collapse internal whitespace; keeps the user's casing for display. */
export const cleanCollegeName = (name: string | null | undefined): string =>
  String(name ?? '').replace(/\s+/g, ' ').trim();

/** Exact comparison key: cleaned, lowercased, without trailing punctuation. */
export const collegeKey = (name: string | null | undefined): string =>
  cleanCollegeName(name).toLowerCase().replace(/[.,]+$/, '');

export const isPlaceholderCollege = (name: string | null | undefined): boolean =>
  PLACEHOLDER_COLLEGES.includes(collegeKey(name));

const FILLER = new Set(['of', 'the', 'and', '&', 'at', 'in', 'for']);

/** Lowercased words without punctuation or filler words. */
export const collegeTokens = (name: string | null | undefined): string[] =>
  collegeKey(name)
    .replace(/[^a-z0-9&\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !FILLER.has(t));

/** Levenshtein distance, stopping early once it exceeds `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Same word, allowing 1 typo for words of 5+ letters and 2 for 8+. */
const sameWord = (a: string, b: string): boolean => {
  if (a === b) return true;
  const len = Math.min(a.length, b.length);
  const allowed = len >= 8 ? 2 : len >= 5 ? 1 : 0;
  return allowed > 0 && editDistance(a, b, allowed) <= allowed;
};

/** Minimum share of the longer name's words the shorter name must cover. */
const MIN_COVERAGE = 0.6;

/**
 * Same college? Placeholders never match. Otherwise either the exact keys are
 * equal, or every word of the shorter name (at least 2 words) matches a
 * distinct word of the longer one and covers >= 60% of it — which allows an
 * extra city/state ("... Kolkata") but not "Netaji Subhash" vs
 * "Netaji Subhash Engineering College".
 */
export const sameCollege = (a: string | null | undefined, b: string | null | undefined): boolean => {
  if (isPlaceholderCollege(a) || isPlaceholderCollege(b)) return false;
  if (collegeKey(a) === collegeKey(b)) return true;

  const ta = collegeTokens(a);
  const tb = collegeTokens(b);
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  if (short.length < 2) return false;
  if (short.length / long.length < MIN_COVERAGE) return false;

  const used = new Set<number>();
  for (const word of short) {
    const idx = long.findIndex((w, i) => !used.has(i) && sameWord(word, w));
    if (idx < 0) return false;
    used.add(idx);
  }
  return true;
};
