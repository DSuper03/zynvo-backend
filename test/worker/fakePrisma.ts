/**
 * Minimal in-memory stand-in for the Prisma client, covering the query shapes
 * used by the core-team, auth and participant-CSV routes. `select`/`include`
 * are ignored (full rows are returned); relations are not resolved.
 */
import { randomUUID } from 'node:crypto';

type Row = Record<string, any>;

const OPERATORS = ['equals', 'contains', 'in', 'gt', 'gte', 'lt', 'lte', 'not', 'mode'];

const isOperatorObject = (v: any) =>
  v && typeof v === 'object' && !(v instanceof Date) && Object.keys(v).some((k) => OPERATORS.includes(k));

function matches(row: Row, where: Row | undefined): boolean {
  if (!where) return true;
  for (const [key, cond] of Object.entries(where)) {
    if (cond === undefined) continue;
    if (key === 'OR') { if (!(cond as Row[]).some((w) => matches(row, w))) return false; continue; }
    if (key === 'AND') { if (!(cond as Row[]).every((w) => matches(row, w))) return false; continue; }
    const value = row[key];
    if (cond === null) { if (value != null) return false; continue; }
    if (cond instanceof Date) { if (!(value instanceof Date) || value.getTime() !== cond.getTime()) return false; continue; }
    if (typeof cond === 'object' && !Array.isArray(cond)) {
      if (!isOperatorObject(cond)) {
        // compound unique key, e.g. { userId_clubId: { userId, clubId } }
        if (!matches(row, cond)) return false;
        continue;
      }
      const ci = cond.mode === 'insensitive';
      const norm = (x: any) => (ci && typeof x === 'string' ? x.toLowerCase() : x);
      if ('equals' in cond && norm(value) !== norm(cond.equals)) return false;
      if ('contains' in cond && !(typeof value === 'string' && norm(value).includes(norm(cond.contains)))) return false;
      if ('in' in cond && !cond.in.map(norm).includes(norm(value))) return false;
      if ('gt' in cond && !(value > cond.gt)) return false;
      if ('gte' in cond && !(value >= cond.gte)) return false;
      if ('lt' in cond && !(value < cond.lt)) return false;
      if ('lte' in cond && !(value <= cond.lte)) return false;
      if ('not' in cond && value === cond.not) return false;
      continue;
    }
    if (value !== cond) return false;
  }
  return true;
}

type UniqueCheck = (rows: Row[], candidate: Row) => boolean;

class Model {
  rows: Row[] = [];
  constructor(private defaults: () => Row = () => ({}), private conflicts: UniqueCheck[] = []) {}

  private conflict(candidate: Row, self?: Row) {
    const others = this.rows.filter((r) => r !== self);
    if (this.conflicts.some((check) => check(others, candidate))) {
      throw Object.assign(new Error('Unique constraint failed'), { code: 'P2002' });
    }
  }

  async findUnique({ where }: Row) { return this.rows.find((r) => matches(r, where)) ?? null; }
  async findFirst({ where }: Row = {}) { return this.rows.find((r) => matches(r, where)) ?? null; }
  async findMany({ where }: Row = {}) { return this.rows.filter((r) => matches(r, where)); }
  async count({ where }: Row = {}) { return this.rows.filter((r) => matches(r, where)).length; }

  async groupBy({ by, where, take }: Row) {
    const field = by[0];
    const counts = new Map<any, number>();
    for (const r of this.rows.filter((r) => matches(r, where))) counts.set(r[field], (counts.get(r[field]) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, take ?? Infinity)
      .map(([value, n]) => ({ [field]: value, _count: { [field]: n } }));
  }

  async create({ data }: Row) {
    const row = { id: randomUUID(), ...this.defaults(), ...data };
    this.conflict(row);
    this.rows.push(row);
    return row;
  }

  async update({ where, data }: Row) {
    const row = this.rows.find((r) => matches(r, where));
    if (!row) throw Object.assign(new Error('Record not found'), { code: 'P2025' });
    this.conflict({ ...row, ...data }, row);
    Object.assign(row, data);
    return row;
  }

  async updateMany({ where, data }: Row) {
    const hits = this.rows.filter((r) => matches(r, where));
    for (const row of hits) {
      this.conflict({ ...row, ...data }, row);
      Object.assign(row, data);
    }
    return { count: hits.length };
  }

  async upsert({ where, create, update }: Row) {
    const row = this.rows.find((r) => matches(r, where));
    if (row) { Object.assign(row, update); return row; }
    return this.create({ data: create });
  }

  async delete({ where }: Row) {
    const i = this.rows.findIndex((r) => matches(r, where));
    if (i < 0) throw Object.assign(new Error('Record not found'), { code: 'P2025' });
    return this.rows.splice(i, 1)[0];
  }

  async deleteMany({ where }: Row = {}) {
    const before = this.rows.length;
    this.rows = this.rows.filter((r) => !matches(r, where));
    return { count: before - this.rows.length };
  }
}

export function createFakePrisma() {
  const db = {
    user: new Model(
      () => ({ createdAt: new Date(), isVerified: false, clubId: null, profileAvatar: null, name: null, clerkId: null }),
      [(rows, c) => rows.some((r) => r.email === c.email)],
    ),
    clubs: new Model(() => ({
      coremember1: 'none', coremember2: 'none', coremember3: 'none', createdAt: new Date(),
    })),
    clubCoreInvite: new Model(
      () => ({ status: 'PENDING', createdAt: new Date() }),
      // partial unique index: (clubId, email) WHERE status = 'PENDING'
      [(rows, c) => c.status === 'PENDING' &&
        rows.some((r) => r.status === 'PENDING' && r.clubId === c.clubId && r.email === c.email)],
    ),
    userClubMembership: new Model(() => ({ joinedAt: new Date() })),
    notification: new Model(() => ({ read: false, createdAt: new Date() })),
    deviceToken: new Model(),
    event: new Model(),
    eventCustomQuestion: new Model(),
    userEvents: new Model(() => ({ joinedAt: new Date() })),
    registrationAnswer: new Model(),
    async $transaction(arg: any) {
      if (Array.isArray(arg)) return Promise.all(arg);
      return arg(db);
    },
  };
  return db;
}

export type FakePrisma = ReturnType<typeof createFakePrisma>;
