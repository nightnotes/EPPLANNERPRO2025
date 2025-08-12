
// --- Enhancements for STREAMS page ---
// expects existing variables and functions from your current streams.js

(function enhanceStreams(){
  const bar = document.querySelector('.totalbar');
  if (!bar) return;

  // Selecteer alles
  const selectAll = document.createElement('button');
  selectAll.className = 'btn'; selectAll.textContent = 'Selecteer alles';
  selectAll.onclick = () => {
    document.querySelectorAll('input[type=checkbox][data-id]').forEach((cb)=> (cb).checked = true);
  };

  // Alles op gisteren
  const allYesterday = document.createElement('button');
  allYesterday.className = 'btn'; allYesterday.textContent = 'Alles op gisteren';
  allYesterday.onclick = () => {
    const y = new Date(); y.setDate(y.getDate()-1);
    const iso = y.toISOString().slice(0,10);
    const to = document.getElementById('toDate');
    if (to) { to.value = iso; (window).renderList?.(); }
  };

  // Saved timestamp
  const stamp = document.createElement('span');
  stamp.className = 'muted';
  function updateStamp() {
    const now = new Date();
    stamp.textContent = `Laatst bewaard: ${now.toLocaleTimeString('nl-NL', {hour:'2-digit', minute:'2-digit'})}`;
  }

  // Hook in existing Cloud bewaren to update timestamp
  const saveBtn = Array.from(bar.querySelectorAll('button')).find(b=>b.textContent?.toLowerCase().includes('cloud bewaren'));
  if (saveBtn) {
    const orig = (saveBtn).onclick;
    (saveBtn).onclick = async ()=>{ if (orig) await orig(new Event('click')); updateStamp(); }
  }

  bar.appendChild(selectAll);
  bar.appendChild(allYesterday);
  bar.appendChild(stamp);

  // Dag opslaan (schrijft naar Netlify en houdt geschiedenis vast)
  const saveDay = document.createElement('button');
  saveDay.className = 'btn';
  saveDay.textContent = 'Dag opslaan';
  saveDay.onclick = async () => {
    // Datum: neem #toDate of gisteren
    const toDateEl = document.getElementById('toDate');
    let dateStr = '';
    if (toDateEl && toDateEl.value) dateStr = toDateEl.value;
    else {
      const d = new Date(Date.now() - 24*3600*1000);
      const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0');
      dateStr = `${y}-${m}-${dd}`;
    }
    // Totaal: uit badge
    const totalEl = document.getElementById('grandTotal');
    const raw = (totalEl?.textContent||'0').replace(/[^\d]/g,'');
    const total = parseInt(raw||'0', 10);
    try {
      await (window).savePersistentPoint(dateStr, total);
      alert('Opgeslagen voor ' + dateStr + ': ' + total.toLocaleString('nl-NL'));
    } catch (e) {
      alert('Opslaan mislukt: ' + (e?.message||e));
    }
  };
  bar.appendChild(saveDay);
  updateStamp();

  // Graph polish: dashed MA7 + number formatting
  const fmt = new Intl.NumberFormat('nl-NL');
  const origRender = (window).renderChart;
  if (typeof origRender === 'function') {
    (window).renderChart = function() {
      origRender();
      const chart = (window).chart;
      if (!chart) return;
      const ds = chart.data.datasets;
      const ma = ds.find((d:any)=> d.label && d.label.toLowerCase().includes('7-daags'));
      if (ma) {
        // dashed line
        ma.borderDash = [6,4];
      }
      chart.options.scales.y.ticks.callback = (v:any) => fmt.format(v);
      chart.update();
    }
  }
})();


  // Shared badge status
  async function updateSharedBadge(){
    const el = document.getElementById('sharedBadge');
    if (!el) return;
    try {
      const r = await fetch('/.netlify/functions/getData?key=streams_timeseries', { cache:'no-store' });
      if (r.ok) {
        el.textContent = 'Gedeelde modus actief';
        el.classList.add('ok'); el.classList.remove('err');
      } else {
        el.textContent = 'Offline modus (alleen lokaal)';
        el.classList.add('err'); el.classList.remove('ok');
      }
    } catch(e){
      el.textContent = 'Offline modus (alleen lokaal)';
      el.classList.add('err'); el.classList.remove('ok');
    }
  }
  updateSharedBadge();
