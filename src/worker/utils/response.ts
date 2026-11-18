import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { HonoEnv } from '../types';
import { logger } from '../logger';

export const generateRequestId = (): string => Math.random().toString(36).substring(2, 9);

export const toStatus = (code: number): ContentfulStatusCode => {
  if (code >= 200 && code < 600 && code !== 204) return code as ContentfulStatusCode;
  return 500;
};

export const jsonError = (
  c: Context<HonoEnv>,
  requestId: string,
  message: string,
  statusCode = 500,
  error?: unknown,
) => {
  // Server-side failures are logged with their real cause; the alerting
  // middleware attaches these lines to the Telegram alert.
  if (statusCode >= 500) {
    const cause = error instanceof Error ? error.message : error === undefined ? undefined : String(error);
    logger.error(`[${requestId}] ${message}`, {
      path: c.req.path,
      ...(cause ? { error: cause.slice(0, 500) } : {}),
      ...((error as any)?.code ? { code: (error as any).code } : {}),
    });
  }
  const payload: Record<string, unknown> = { msg: message, requestId };
  if (c.env.NODE_ENV === 'development' && error) {
    payload.error = error instanceof Error ? error.message : String(error);
  }
  return c.json(payload, toStatus(statusCode));
};
