import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import eventsRouter from './routes/events';
import type { HonoEnv } from './types';

export const honoApp = new Hono<HonoEnv>();
export const HONO_NOT_FOUND_HEADER = 'x-hono-not-found';

const FE_URL = process.env.FE_URL;
const FRONTEND_URL = [
  FE_URL,
  'http://localhost:3000',
  'https://zynvo.social',
  'https://zynvo-main.vercel.app',
].filter(Boolean) as string[];

const corsOrigins = FRONTEND_URL.length > 0 ? FRONTEND_URL : '*';

honoApp.use('*', honoLogger());
honoApp.use(
  '*',
  cors({
    origin: corsOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

honoApp.notFound((c) => {
  c.header(HONO_NOT_FOUND_HEADER, '1');
  return c.json({ msg: 'not found' }, 404);
});

honoApp.get('/health', (c) => c.json({ msg: 'good health' }));
honoApp.route('/events', eventsRouter);
