const FRESH_MS = 6 * 60 * 60 * 1000;

export type LiveAppUpdate = {
  id: string;
  createdAt?: string;
  version?: string;
  message?: string;
};

export function shouldAnnounceAppUpdate(previousId: string | null, update: LiveAppUpdate | null, now = Date.now()): boolean {
  if (!update?.id || update.id === previousId) return false;
  if (previousId !== null) return true;
  const created = update.createdAt ? Date.parse(update.createdAt) : NaN;
  if (!Number.isFinite(created)) return false;
  return now - created >= 0 && now - created <= FRESH_MS;
}

export function appUpdateCopy(update: LiveAppUpdate): { title: string; body: string } {
  const message = update.message?.replace(/\s+/g, ' ').trim();
  const version = update.version?.trim();
  return {
    title: 'Zynvo updated',
    body: message
      ? message.slice(0, 180)
      : version
        ? `Version ${version} is live. Open the app to get it.`
        : 'A new version is live. Open the app to get it.',
  };
}

/** Expo's update response is JSON, or a multipart body whose manifest part is JSON. */
export function parseExpoManifest(body: string): LiveAppUpdate | null {
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(body.slice(start, end + 1)) as {
      id?: unknown;
      createdAt?: unknown;
      metadata?: { message?: unknown };
      extra?: { expoClient?: { version?: unknown; extra?: { updateMessage?: unknown } } };
    };
    if (typeof parsed.id !== 'string' || !parsed.id) return null;
    const version = parsed.extra?.expoClient?.version;
    const message = parsed.metadata?.message ?? parsed.extra?.expoClient?.extra?.updateMessage;
    return {
      id: parsed.id,
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : undefined,
      version: typeof version === 'string' ? version : undefined,
      message: typeof message === 'string' ? message : undefined,
    };
  } catch {
    return null;
  }
}
