import { beforeEach, expect, it, vi } from 'vitest';
import { announcePlayRelease } from '../src/worker/play-release';
import type { CFEnv } from '../src/worker/types';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  findMany: vi.fn(),
  createMany: vi.fn(),
  disconnect: vi.fn(),
  push: vi.fn(),
}));

vi.mock('../src/worker/db', () => ({
  createPrismaClient: () => ({
    user: { findMany: mocks.findMany },
    notification: { createMany: mocks.createMany },
    $disconnect: mocks.disconnect,
  }),
}));
vi.mock('../src/worker/fcm', () => ({
  isFcmConfigured: () => true,
  sendToTopic: mocks.push,
}));

const env = { ALERTS_KV: { get: mocks.get, put: mocks.put } } as unknown as CFEnv;

beforeEach(() => {
  vi.resetAllMocks();
  mocks.findMany.mockResolvedValue([{ id: 'user-one' }]);
  mocks.disconnect.mockResolvedValue(undefined);
});

it('writes a retry-safe inbox entry and sends a distinct Play notification', async () => {
  expect(await announcePlayRelease(env, 49, '1.0.4')).toBe(true);
  expect(mocks.createMany).toHaveBeenCalledWith({
    skipDuplicates: true,
    data: [expect.objectContaining({
      id: 'play-release:49:user-one',
      userId: 'user-one',
      type: 'play_store_update',
    })],
  });
  expect(mocks.push).toHaveBeenCalledWith(expect.anything(), 'all_users', expect.anything(), {
    type: 'play_store_update', versionCode: '49', versionName: '1.0.4',
  });
  expect(mocks.put).toHaveBeenCalledWith('play-release:49', 'sent');
});

it('skips a version code already announced', async () => {
  mocks.get.mockResolvedValue('sent');
  expect(await announcePlayRelease(env, 49, '1.0.4')).toBe(false);
  expect(mocks.createMany).not.toHaveBeenCalled();
  expect(mocks.push).not.toHaveBeenCalled();
});

it('leaves the release eligible for retry if Firebase rejects the push', async () => {
  mocks.push.mockRejectedValue(new Error('Firebase unavailable'));
  await expect(announcePlayRelease(env, 49, '1.0.4')).rejects.toThrow('Firebase unavailable');
  expect(mocks.put).not.toHaveBeenCalled();
  expect(mocks.disconnect).toHaveBeenCalled();
});
