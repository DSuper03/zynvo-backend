import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client } from 'pg';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Prisma } from '@prisma/client';
import {
  getLeaderboard,
  parseLeaderboardOptions,
} from '../src/worker/utils/leaderboard';

// Set only to an isolated test database. Never use the application's production URL.
const testUrl = process.env.LEADERBOARD_TEST_DATABASE_URL;
const schema = 'leaderboard_test_' + randomUUID().replace(/-/g, '');
const now = new Date('2026-11-22T12:00:00Z');
let client: Client;
const db = {
  async $queryRaw<T>(query: Prisma.Sql): Promise<T> {
    return (
      await client.query(
        query.text,
        query.values.map((value) =>
          value instanceof Date ? value.toISOString() : value
        )
      )
    ).rows as T;
  },
};

describe.skipIf(!testUrl)('PostgreSQL production compatibility', () => {
  beforeAll(async () => {
    const url = new URL(testUrl!);
    if (url.pathname !== '/leaderboard_test')
      throw new Error(
        'Integration tests require a dedicated leaderboard_test database'
      );
    client = new Client({ connectionString: testUrl });
    await client.connect();
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET search_path TO "${schema}", public`);
    await client.query(`
      CREATE TABLE clubs (id text PRIMARY KEY,name text,"collegeName" text,"profilePicUrl" text);
      CREATE TABLE event (id text PRIMARY KEY,"EventName" text,"posterUrl" text,"clubId" text,"isPaid" boolean DEFAULT false,"coreTeamOnly" boolean DEFAULT false,"applicationStatus" text DEFAULT 'open');
      CREATE TABLE "userEvents" ("userId" text,"eventId" text,"joinedAt" timestamp(3) NOT NULL DEFAULT '2026-11-20T12:00:00',"approvalStatus" text DEFAULT 'approved',"paymentStatus" text DEFAULT 'CONFIRMED',"paymentVerifiedAt" timestamp(3),PRIMARY KEY("userId","eventId"));
      INSERT INTO clubs VALUES ('c1','Club One','Campus A',NULL),('c2','Club Two','Campus B',NULL);
      INSERT INTO event(id,"EventName","clubId","isPaid") VALUES ('e1','Free','c1',false),('e2','Paid','c1',true),('e3','Other','c2',false);
      INSERT INTO "userEvents"("userId","eventId","paymentStatus","paymentVerifiedAt") VALUES ('u1','e1','CONFIRMED',NULL),('u2','e1','CONFIRMED',NULL),('u3','e2','APPROVED','2026-11-21'),('u4','e2','CONFIRMED',NULL),('u1','e3','CONFIRMED',NULL);
    `);
  });
  afterAll(async () => {
    if (!client) return;
    try {
      await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    } finally {
      await client.end();
    }
  });
  it('builds both indexes concurrently outside a transaction', async () => {
    for (const migration of [
      '20261122000000_leaderboard_indexes',
      '20261122000100_leaderboard_event_index',
    ]) {
      await client.query(
        readFileSync(
          resolve('prisma/migrations', migration, 'migration.sql'),
          'utf8'
        )
      );
    }
    const result = await client.query(
      `SELECT indexrelid::regclass::text AS name,indisvalid FROM pg_index WHERE indrelid='"userEvents"'::regclass`
    );
    expect(result.rows).toHaveLength(3);
    expect(result.rows.every((row) => row.indisvalid)).toBe(true);
  });
  it('runs parameterized aggregation using Prisma timestamp types and PostgreSQL JSON', async () => {
    const result = await getLeaderboard(
      db,
      parseLeaderboardOptions(new URLSearchParams()),
      now
    );
    expect(result.entries[0]).toMatchObject({
      id: 'c1',
      registrations: 3,
      uniqueStudents: 3,
      eventsCount: 2,
      rank: 1,
    });
    expect(result.totals).toEqual({
      registrations: 4,
      uniqueStudents: 3,
      eventsCount: 3,
      rankedCount: 2,
    });
  });
  it('aggregates a populated registration table without transferring participant records', async () => {
    await client.query(
      `INSERT INTO "userEvents"("userId","eventId") SELECT 'bulk-'||n,'e1' FROM generate_series(1,10000) n`
    );
    const result = await getLeaderboard(
      db,
      parseLeaderboardOptions(new URLSearchParams('kind=events')),
      now
    );
    expect(result.entries[0]).toMatchObject({ id: 'e1', registrations: 10002 });
    expect(result.totals.registrations).toBe(10004);
    expect(result.entries).toHaveLength(3);
  });
});
