
// --- Enhancements for STREAMS page ---
// expects existing variables and functions from your current streams.js

(function enhanceStreams(){
  const bar = document.querySelector('.totalbar');
  if (!bar) return;

  // Selecteer alles
  const selectAll = document.createElement('button');
  selectAll.className = 'btn'; selectAll.textContent = 'Selecteer alles';
  selectAll.onclick = () => {
    document.querySelectorAll('input[type=checkbox][data-id]').forEach((cb)=> (cb as HTMLInputElement).checked = true);
  };

  // Alles op gisteren
  const allYesterday = document.createElement('button');
  allYesterday.className = 'btn'; allYesterday.textContent = 'Alles op gisteren';
  allYesterday.onclick = () => {
    const y = new Date(); y.setDate(y.getDate()-1);
    const iso = y.toISOString().slice(0,10);
    const to = document.getElementById('toDate') as HTMLInputElement;
    if (to) { to.value = iso; (window as any).renderList?.(); }
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
    const orig = (saveBtn as HTMLButtonElement).onclick;
    (saveBtn as HTMLButtonElement).onclick = async ()=>{ if (orig) await orig(new Event('click')); updateStamp(); }
  }

  bar.appendChild(selectAll);
  bar.appendChild(allYesterday);
  bar.appendChild(stamp);
  updateStamp();

  // Graph polish: dashed MA7 + number formatting
  const fmt = new Intl.NumberFormat('nl-NL');
  const origRender = (window as any).renderChart;
  if (typeof origRender === 'function') {
    (window as any).renderChart = function() {
      origRender();
      const chart = (window as any).chart;
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
