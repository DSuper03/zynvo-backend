/**
 * CF-safe logger — replaces winston which relies on Node.js fs/streams.
 * Same call signature so route files read naturally.
 *
 * Inside a request (see middleware/alerting.ts) warn/error entries are also
 * collected so a failing request's alert can include them.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export type CapturedLog = { level: LogLevel; entry: string; notify: boolean };
export type RequestLogStore = { logs: CapturedLog[] };

export const requestLogs = new AsyncLocalStorage<RequestLogStore>();

const MAX_CAPTURED = 20;

const log = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
  const entry = meta
    ? `[${level.toUpperCase()}] ${message} ${JSON.stringify(meta)}`
    : `[${level.toUpperCase()}] ${message}`;

  if (level === 'error') {
    console.error(entry);
  } else if (level === 'warn') {
    console.warn(entry);
  } else {
    console.log(entry);
  }

  if (level === 'error' || level === 'warn') {
    const store = requestLogs.getStore();
    if (store && store.logs.length < MAX_CAPTURED) {
      store.logs.push({ level, entry, notify: meta?.notify === true });
    }
  }
};

export const logger = {
  info:  (message: string, meta?: Record<string, unknown>) => log('info',  message, meta),
  warn:  (message: string, meta?: Record<string, unknown>) => log('warn',  message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
};
