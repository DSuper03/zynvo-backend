import { describe, expect, it } from 'vitest';
import { appUpdateCopy, parseExpoManifest, shouldAnnounceAppUpdate } from '../src/worker/app-update-policy';

const now = Date.parse('2026-11-21T12:00:00.000Z');

describe('live app update announcement', () => {
  it('stays quiet when nothing is published or the same update is still live', () => {
    expect(shouldAnnounceAppUpdate(null, null, now)).toBe(false);
    expect(shouldAnnounceAppUpdate('u1', { id: 'u1', createdAt: '2026-11-21T11:00:00.000Z' }, now)).toBe(false);
  });

  it('announces a new update, and a first sighting only when it was just published', () => {
    expect(shouldAnnounceAppUpdate('u1', { id: 'u2', createdAt: '2026-11-20T00:00:00.000Z' }, now)).toBe(true);
    expect(shouldAnnounceAppUpdate(null, { id: 'u2', createdAt: '2026-11-21T11:30:00.000Z' }, now)).toBe(true);
    expect(shouldAnnounceAppUpdate(null, { id: 'old', createdAt: '2026-11-01T00:00:00.000Z' }, now)).toBe(false);
  });

  it('reads the manifest id, version, and message', () => {
    const update = parseExpoManifest(JSON.stringify({
      id: 'abc',
      createdAt: '2026-11-21T11:00:00.000Z',
      extra: { expoClient: { version: '1.0.5' } },
      metadata: { message: 'Tickets save to Photos.' },
    }));
    expect(update).toEqual({
      id: 'abc',
      createdAt: '2026-11-21T11:00:00.000Z',
      version: '1.0.5',
      message: 'Tickets save to Photos.',
    });
    expect(appUpdateCopy(update!)).toEqual({ title: 'Zynvo updated', body: 'Tickets save to Photos.' });
    expect(appUpdateCopy({ id: 'abc', version: '1.0.5' }).body).toBe('Version 1.0.5 is live. Open the app to get it.');
  });

  it('ignores an empty update response', () => {
    expect(parseExpoManifest('')).toBeNull();
    expect(parseExpoManifest('not json')).toBeNull();
  });
});
