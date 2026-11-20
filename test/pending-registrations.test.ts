import { describe, expect, it } from 'vitest';
import { eventStartsInReminderWindow } from '../src/worker/pending-registrations';

describe('pending registration reminder window', () => {
  const now = Date.parse('2026-12-01T10:00:00.000Z');

  it('includes a start from the last three hours', () => {
    expect(eventStartsInReminderWindow('2026-12-01T08:00:00.000Z', now)).toBe(true);
    expect(eventStartsInReminderWindow('2026-12-01T10:00:00.000Z', now)).toBe(true);
  });

  it('skips future starts and starts older than three hours', () => {
    expect(eventStartsInReminderWindow('2026-12-01T10:01:00.000Z', now)).toBe(false);
    expect(eventStartsInReminderWindow('2026-12-01T06:59:00.000Z', now)).toBe(false);
    expect(eventStartsInReminderWindow('', now)).toBe(false);
    expect(eventStartsInReminderWindow('not a date', now)).toBe(false);
  });
});
