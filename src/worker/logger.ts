/**
 * CF-safe logger — replaces winston which relies on Node.js fs/streams.
 * Same call signature so route files read naturally.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

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
};

export const logger = {
  info:  (message: string, meta?: Record<string, unknown>) => log('info',  message, meta),
  warn:  (message: string, meta?: Record<string, unknown>) => log('warn',  message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
};
