import { generateKeyPairSync } from 'node:crypto';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { sendToDeviceTokens, sendToTopic, subscribeTokenToTopic } from '../../src/worker/fcm';

const config = {
  projectId: 'test-project',
  clientEmail: 'push@example.test',
  privateKey: generateKeyPairSync('rsa', { modulusLength: 2048 })
    .privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
};
const copy = { title: 'You are in!', body: 'Your ticket is ready.' };
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValueOnce(Response.json({ access_token: 'test-access-token' }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

it('sends event decisions as visible, audible alerts even without app JavaScript', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ name: 'message-id' }));
  const data = { type: 'event_approval', route: '/ticket/demo' };
  expect(await sendToDeviceTokens(config, ['test-device'], copy, data)).toMatchObject({ successCount: 1 });
  const message = JSON.parse(String(fetchMock.mock.calls[1][1]?.body)).message;
  expect(message).toMatchObject({
    token: 'test-device',
    notification: copy,
    data,
    android: { priority: 'high', notification: { channel_id: 'events', sound: 'default' } },
  });
});

it.each([
  ['club_event', 'events'],
  ['campus_drop', 'social'],
  ['play_store_update', 'app_updates'],
  ['broadcast', 'new_posts'],
])('uses the same alert format for topic pushes of type %s', async (type, channelId) => {
  fetchMock.mockResolvedValueOnce(Response.json({ name: 'message-id' }));
  await sendToTopic(config, 'test-topic', copy, { type });
  expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body)).message).toMatchObject({
    topic: 'test-topic',
    notification: copy,
    android: { notification: { channel_id: channelId, sound: 'default' } },
  });
});

it('treats a rejected subscription as failed even when Firebase returns HTTP 200', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ results: [{ error: 'INVALID_ARGUMENT' }] }));
  await expect(subscribeTokenToTopic(config, 'test-device', 'all_users')).rejects.toThrow('INVALID_ARGUMENT');
  expect(fetchMock.mock.calls[1][0]).toBe('https://iid.googleapis.com/iid/v1:batchAdd');
});

it('only marks unregistered tokens for removal and counts an unreadable error once', async () => {
  fetchMock
    .mockResolvedValueOnce(Response.json({ error: { details: [{ errorCode: 'UNREGISTERED' }] } }, { status: 404 }))
    .mockResolvedValueOnce(Response.json({ error: { status: 'INVALID_ARGUMENT' } }, { status: 400 }))
    .mockResolvedValueOnce(new Response('unavailable', { status: 503 }));
  expect(await sendToDeviceTokens(config, ['stale', 'invalid-payload', 'unavailable'], copy)).toEqual({
    successCount: 0, failureCount: 3, invalidTokens: ['stale'],
  });
});
