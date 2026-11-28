const SOURCE = 'https://www.kolkatacentreforcreativity.org';
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export function parseKolkataDate(label: string) {
  const match = label.match(/^(\d{1,2})(?:st|nd|rd|th)?(?:\s*[–-]\s*(\d{1,2})(?:st|nd|rd|th)?)?\s+([A-Za-z]+),?\s+(20\d{2})$/i);
  if (!match) return null;
  const [, first, last, monthName, year] = match;
  const month = MONTHS.findIndex((name) => name === monthName.toLowerCase() || name.slice(0, 3) === monthName.toLowerCase());
  const days = new Date(Date.UTC(Number(year), month + 1, 0)).getUTCDate();
  if (month < 0 || +first < 1 || +(last ?? first) < +first || +(last ?? first) > days) return null;
  const offset = 330 * 60_000;
  return {
    startsAt: new Date(Date.UTC(+year, month, +first) - offset),
    endsAt: new Date(Date.UTC(+year, month, +(last ?? first) + 1) - offset),
  };
}

function clean(value: string) {
  return value
    .replace(/&(?:amp|quot|apos|nbsp|#39);/g, (entity) => ({
      '&amp;': '&', '&quot;': '"', '&apos;': "'", '&nbsp;': ' ', '&#39;': "'",
    })[entity] ?? entity)
    .replace(/\s+/g, ' ').trim();
}

export async function readKccEvent(sourceUrl: string) {
  const key = new URL(sourceUrl);
  const id = key.pathname.match(/^\/event-details\/(\d+)\/[a-z0-9-]+$/i)?.[1];
  if (key.origin !== SOURCE || !id) return null;
  const response = await fetch(sourceUrl, { redirect: 'error', signal: AbortSignal.timeout(7_000) });
  if (!response.ok) return null;
  const html = await response.text();
  const title = clean(html.match(/<h2\b[^>]*class="pxl-item--title[^"]*"[^>]*>([^<]{1,500})<\/h2>/i)?.[1] ?? '');
  const fields = [...html.matchAll(/<p\b[^>]*class="stander-15-detail[^"]*"[^>]*>([^<]{1,500})<\/p>/gi)].map((match) => clean(match[1]));
  const venue = fields.find((value) => /^Venue:/i.test(value))?.slice(6).trim();
  const dateLabel = fields.find((value) => /^Date:/i.test(value))?.slice(5).trim();
  const dates = dateLabel && parseKolkataDate(dateLabel);
  if (!title || !venue || !dateLabel || !dates || !/\b(?:KCC|Kolkata)\b/i.test(venue)) return null;
  if (/\b(?:cancelled|canceled|postponed)\b/i.test([title, ...fields].join(' '))) return null;
  const priceLabel = fields.find((value) => /^(?:price|fee|entry fee):/i.test(value))?.split(':').slice(1).join(':').trim() ?? null;
  const fingerprint = [title, venue].map((value) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')).join(':') + ':' + dates.startsAt.toISOString();
  return { id: 'kcc-' + id, fingerprint, title, venue, dateLabel, ...dates, priceLabel, sourceUrl };
}

export async function listKccEvents() {
  const response = await fetch(SOURCE + '/include/fetch-kcc-home-now-upcoming-events.php', {
    method: 'POST',
    body: new URLSearchParams({ filter_date: '', filter_event_type: '', filter_audience: '', filter_is_paid: '' }),
    redirect: 'error',
    signal: AbortSignal.timeout(7_000),
  });
  if (!response.ok) throw new Error('Organizer calendar returned HTTP ' + response.status);
  const html = await response.text();
  return [...new Set(html.match(/https:\/\/www\.kolkatacentreforcreativity\.org\/event-details\/\d+\/[a-z0-9-]+/gi) ?? [])].slice(0, 18);
}
