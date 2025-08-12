
import { getStore } from '@netlify/blobs';
export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    if (!key) return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400 });
    const store = getStore({ name: 'epplanner' });
    const val = await store.get(key, { type: 'json' });
    return new Response(JSON.stringify(val || {}), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
