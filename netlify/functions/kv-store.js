export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  const url = new URL(context.request.url);
  const key = url.searchParams.get('key');
  if (!key) return json({ error: 'Missing key' }, 400);

  if (context.request.method === 'GET') {
    const data = await context.blob.get(key);
    if (!data) return json({ ok: true, value: null }, 200);
    const text = await data.text();
    return json({ ok: true, value: JSON.parse(text) }, 200);
  }

  if (context.request.method === 'POST') {
    const body = await context.request.json();
    await context.blob.set(key, JSON.stringify(body));
    return json({ ok: true }, 200);
  }

  return json({ error: 'Method not allowed' }, 405);

  function json(obj, status=200) {
    return new Response(JSON.stringify(obj), { status, headers: { ...cors(), 'content-type':'application/json' } });
  }
  function cors() {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    };
  }
}