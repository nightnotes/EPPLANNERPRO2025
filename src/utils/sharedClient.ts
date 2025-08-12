
export async function getShared(key) {
  const res = await fetch('/.netlify/functions/getData?key=' + encodeURIComponent(key), { cache: 'no-store' });
  return res.json();
}
export async function setShared(key, value) {
  const res = await fetch('/.netlify/functions/setData', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ key, value }),
  });
  return res.json();
}
export async function appendStreamsPoint(dateStr, streams) {
  const res = await fetch('/.netlify/functions/appendStreams', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ date: dateStr, streams }),
  });
  return res.json();
}
export function startPolling(key, onData, intervalMs = 5000) {
  let stop = false;
  async function tick() {
    if (stop) return;
    try {
      const data = await getShared(key);
      onData && onData(data);
    } catch (e) {
      console.error('poll error', e);
    } finally {
      if (!stop) setTimeout(tick, intervalMs);
    }
  }
  tick();
  return () => { stop = true; };
}
