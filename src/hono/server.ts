import { serve } from '@hono/node-server';
import { honoApp } from './app';

let started = false;

export const startHonoServer = () => {
  if (started) return;
  started = true;

  const port = Number(process.env.HONO_PORT ?? 8001);
  serve({ fetch: honoApp.fetch, port });
  console.log(`Hono server running on port ${port}`);
};
