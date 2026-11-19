/**
 * Content moderation with Workers AI (Llama Guard 3, free tier) feeding the
 * Telegram alerts. Runs after the response is sent; never blocks or fails a
 * request. Without the AI binding it does nothing.
 */
import type { Context } from 'hono';
import type { CFEnv, HonoEnv } from './types';
import { raiseAlert } from './alerts';
import { logger } from './logger';

// ~9 neurons per check (measured), so the free 10,000/day covers ~1,000
// posts + comments a day; past that the AI call fails and moderation is skipped.
// Workers AI returns plain text: "\n\nsafe" or "\n\nunsafe\nS1".
const MODEL = '@cf/meta/llama-guard-3-8b';
const MAX_CHARS = 2000;

// Llama Guard 3 hazard categories. Only the ones that matter for a student
// community raise alerts; advice, IP, elections and code abuse are ignored.
const CATEGORIES: Record<string, string> = {
  S1: 'violent crimes',
  S2: 'non-violent crimes',
  S3: 'sex-related crimes',
  S4: 'child sexual exploitation',
  S5: 'defamation',
  S7: 'privacy (personal info)',
  S9: 'weapons',
  S10: 'hate',
  S11: 'suicide & self-harm',
  S12: 'sexual content',
};

export type ModerationResult = { flagged: boolean; categories: string[] };

/** Parses both the structured ({ safe, categories }) and raw ("unsafe\nS10") outputs. */
export function parseVerdict(output: unknown): ModerationResult | null {
  const r = (output as any)?.response ?? output;
  let safe: boolean | undefined;
  let codes: string[] = [];
  if (r && typeof r === 'object') {
    safe = typeof r.safe === 'boolean' ? r.safe : undefined;
    codes = Array.isArray(r.categories) ? r.categories.map(String) : [];
  } else if (typeof r === 'string') {
    const text = r.trim().toLowerCase();
    safe = text.startsWith('safe');
    codes = r.match(/S\d{1,2}/g) ?? [];
  }
  if (safe === undefined) return null;
  const relevant = [...new Set(codes.map((c) => c.toUpperCase()))].filter((c) => c in CATEGORIES);
  return { flagged: !safe && relevant.length > 0, categories: relevant.map((c) => CATEGORIES[c]) };
}

export async function moderateText(env: CFEnv, text: string): Promise<ModerationResult | null> {
  if (!env.AI || !text.trim()) return null;
  try {
    const out = await (env.AI as any).run(MODEL, {
      messages: [{ role: 'user', content: text.slice(0, MAX_CHARS) }],
    });
    return parseVerdict(out);
  } catch (err: any) {
    logger.warn('moderation unavailable', { error: String(err?.message ?? err).slice(0, 200) });
    return null;
  }
}

const snippet = (text: string) => (text.length > 300 ? `${text.slice(0, 297)}…` : text);

const inBackground = (c: Context<HonoEnv>, work: Promise<unknown>) => {
  try {
    c.executionCtx.waitUntil(work);
  } catch {
    void work;
  }
};

/** Checks new or edited user content; alerts when it is harmful. */
export function moderateInBackground(
  c: Context<HonoEnv>,
  item: { kind: 'post' | 'comment'; id: string; authorId: string; text: string },
): void {
  const env = c.env;
  inBackground(
    c,
    (async () => {
      const verdict = await moderateText(env, item.text);
      if (!verdict?.flagged) return;
      await raiseAlert(env, {
        key: `moderation ${item.kind} ${item.id}`,
        title: `🛡️ Flagged ${item.kind}: ${verdict.categories.join(', ')}`,
        detail: `${item.kind} id: ${item.id}\nauthor id: ${item.authorId}\n\n"${snippet(item.text)}"`,
        source: 'moderation',
      });
    })(),
  );
}

/** Alerts on every new report, with the AI's verdict on the reported text when there is one. */
export function alertOnReport(
  c: Context<HonoEnv>,
  report: { targetType: string; targetId: string; reason: string; details?: string | null; text?: string | null },
): void {
  const env = c.env;
  inBackground(
    c,
    (async () => {
      const verdict = report.text ? await moderateText(env, report.text) : null;
      const ai = !verdict
        ? ''
        : verdict.flagged
          ? `AI check: ⚠️ ${verdict.categories.join(', ')}`
          : 'AI check: looks safe';
      await raiseAlert(env, {
        key: `report ${report.targetType} ${report.targetId} ${report.reason}`,
        title: `🚩 New report (${report.reason}) on ${report.targetType}`,
        detail: [
          `${report.targetType} id: ${report.targetId}`,
          report.details ? `reporter says: "${snippet(report.details)}"` : '',
          ai,
          report.text ? `\n"${snippet(report.text)}"` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        source: 'moderation',
      });
    })(),
  );
}
