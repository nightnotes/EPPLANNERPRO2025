import { getStore } from '@netlify/blobs';
export default async (req, context) => {
  try {
    if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Use POST' }), { status: 405 });
    const body = await req.json();
    const { key, value } = body || {};
    if (!key) return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400 });
    const store = getStore({ name: 'epplanner' });
    await store.setJSON(key, value ?? {});
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
  } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};