import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

const generateRequestId = (): string => Math.random().toString(36).substring(7);

const toContentfulStatus = (statusCode: number): ContentfulStatusCode => {
  if (statusCode >= 200 && statusCode < 600 && statusCode !== 204) {
    return statusCode as ContentfulStatusCode;
  }
  return 500;
};

const jsonError = (
  c: Context,
  requestId: string,
  message: string,
  statusCode: number = 500,
  error?: unknown,
) => {
  const payload: Record<string, unknown> = { msg: message, requestId };
  if (process.env.NODE_ENV === 'development' && error) {
    payload.error = error instanceof Error ? error.message : String(error);
  }
  return c.json(payload, toContentfulStatus(statusCode));
};

export { generateRequestId, jsonError };
