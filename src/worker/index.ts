import { Hono } from 'hono';
import type { Context } from 'hono';

const app = new Hono();

app.get('/health', (c: Context) => c.json({ msg: 'good health' }));

app.all('/graphql', () =>
  new Response('GraphQL endpoint not yet migrated to Workers runtime.', { status: 501 })
);

app.all('*', () => new Response('Not implemented on Workers yet.', { status: 501 }));

export default app;
