import { getStore } from '@netlify/blobs';

const headers = { 'Content-Type': 'application/json' };

export async function handler(event: any) {
  const store = getStore('releasestatus');
  const key = 'statuses.json';

  if (event.httpMethod === 'GET') {
    const data = await store.get(key, { type: 'json' }) as Record<string, 'red'|'green'> | null;
    return { statusCode: 200, headers, body: JSON.stringify(data || {}) };
  }

  if (event.httpMethod === 'POST') {
    try {
      const { k, status } = JSON.parse(event.body || '{}');
      if (!k || (status !== 'red' && status !== 'green')) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Bad input' }) };
      }
      const data = (await store.get(key, { type: 'json' })) as Record<string, 'red'|'green'> || {};
      data[k] = status;
      await store.set(key, JSON.stringify(data));
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
}
