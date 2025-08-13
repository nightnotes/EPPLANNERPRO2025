import { getStore } from '@netlify/blobs';
export default async (req, context) => {
  try {
    if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Use POST' }), { status: 405 });
    const body = await req.json();
    const { date, streams } = body || {};
    if (!date || typeof streams !== 'number') return new Response(JSON.stringify({ error: 'Missing date or streams' }), { status: 400 });
    const store = getStore({ name: 'epplanner' });
    const key = 'streams_timeseries';
    const series = (await store.get(key, { type: 'json' })) || [];
    const idx = series.findIndex(p => p.date === date);
    if (idx >= 0) series[idx].streams = streams; else series.push({ date, streams });
    series.sort((a, b) => a.date.localeCompare(b.date));
    await store.setJSON(key, series);
    return new Response(JSON.stringify({ ok: true, series }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
  } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
};