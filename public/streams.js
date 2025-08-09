
const FIXED_FROM = '';
let ARTISTS = [];

// Load artists dynamically so je alleen artists.json hoeft te updaten
fetch('/artists.json').then(r=>r.json()).then(list=>{ ARTISTS = list; renderList(); updateGrandTotal(); });

let PRELOAD_DATA = [{"date": "2025-01-13", "value": 78300}, {"date": "2025-01-14", "value": 72300}, {"date": "2025-01-15", "value": 71200}, {"date": "2025-01-16", "value": 72200}, {"date": "2025-01-17", "value": 71200}, {"date": "2025-01-18", "value": 68800}, {"date": "2025-01-19", "value": 64900}, {"date": "2025-01-20", "value": 81388}, {"date": "2025-01-21", "value": 84548}, {"date": "2025-01-22", "value": 71648}, {"date": "2025-01-23", "value": 72983}, {"date": "2025-01-24", "value": 78542}, {"date": "2025-01-25", "value": 72920}, {"date": "2025-01-26", "value": 75}, {"date": "2025-01-27", "value": 81479}, {"date": "2025-01-28", "value": 88440}, {"date": "2025-01-29", "value": 88427}, {"date": "2025-01-30", "value": 85708}, {"date": "2025-01-31", "value": 77766}, {"date": "2025-02-01", "value": 69632}, {"date": "2025-02-02", "value": 76901}, {"date": "2025-02-03", "value": 87231}, {"date": "2025-02-04", "value": 83098}, {"date": "2025-02-05", "value": 82231}, {"date": "2025-02-06", "value": 79046}, {"date": "2025-02-07", "value": 87335}, {"date": "2025-02-08", "value": 77631}, {"date": "2025-02-09", "value": 86418}, {"date": "2025-02-10", "value": 95644}, {"date": "2025-02-11", "value": 91113}, {"date": "2025-02-12", "value": 91177}, {"date": "2025-02-13", "value": 123011}, {"date": "2025-02-14", "value": 100442}, {"date": "2025-02-15", "value": 82449}, {"date": "2025-02-16", "value": 88201}, {"date": "2025-02-17", "value": 99872}, {"date": "2025-02-18", "value": 95885}, {"date": "2025-02-19", "value": 92742}, {"date": "2025-02-20", "value": 100514}, {"date": "2025-02-21", "value": 101955}, {"date": "2025-02-22", "value": 91912}, {"date": "2025-02-23", "value": 81755}, {"date": "2025-02-24", "value": 116857}, {"date": "2025-02-25", "value": 104976}, {"date": "2025-02-26", "value": 116111}, {"date": "2025-02-27", "value": 100619}, {"date": "2025-02-28", "value": 109579}, {"date": "2025-03-01", "value": 99010}, {"date": "2025-03-02", "value": 95336}, {"date": "2025-03-03", "value": 99167}, {"date": "2025-03-04", "value": 115187}, {"date": "2025-03-05", "value": 119393}, {"date": "2025-03-06", "value": 100769}, {"date": "2025-03-07", "value": 101917}, {"date": "2025-03-08", "value": 105492}, {"date": "2025-03-09", "value": 103189}, {"date": "2025-03-10", "value": 124574}, {"date": "2025-03-11", "value": 114908}, {"date": "2025-03-12", "value": 137344}, {"date": "2025-03-13", "value": 124536}, {"date": "2025-03-14", "value": 147084}, {"date": "2025-03-15", "value": 101539}, {"date": "2025-03-16", "value": 111709}, {"date": "2025-03-17", "value": 123683}, {"date": "2025-03-18", "value": 135140}, {"date": "2025-03-19", "value": 133595}, {"date": "2025-03-20", "value": 117496}, {"date": "2025-03-21", "value": 99457}, {"date": "2025-03-22", "value": 102341}, {"date": "2025-03-23", "value": 109223}, {"date": "2025-03-24", "value": 123179}, {"date": "2025-03-25", "value": 116506}, {"date": "2025-03-26", "value": 102784}, {"date": "2025-03-27", "value": 104518}, {"date": "2025-03-28", "value": 102949}, {"date": "2025-03-29", "value": 94426}, {"date": "2025-03-30", "value": 86858}, {"date": "2025-03-31", "value": 98388}, {"date": "2025-04-01", "value": 98834}, {"date": "2025-04-02", "value": 98371}, {"date": "2025-04-03", "value": 108436}, {"date": "2025-04-04", "value": 117758}, {"date": "2025-04-05", "value": 115723}, {"date": "2025-04-06", "value": 114855}, {"date": "2025-04-07", "value": 124349}, {"date": "2025-04-08", "value": 109133}, {"date": "2025-04-09", "value": 102393}, {"date": "2025-04-10", "value": 104405}, {"date": "2025-04-11", "value": 107500}, {"date": "2025-04-12", "value": 91456}, {"date": "2025-04-13", "value": 111216}, {"date": "2025-04-14", "value": 120043}, {"date": "2025-04-15", "value": 131278}, {"date": "2025-04-16", "value": 119549}, {"date": "2025-04-17", "value": 125085}, {"date": "2025-04-18", "value": 111370}, {"date": "2025-04-19", "value": 106061}, {"date": "2025-04-20", "value": 102841}, {"date": "2025-04-21", "value": 113288}, {"date": "2025-04-22", "value": 120067}, {"date": "2025-04-23", "value": 118931}, {"date": "2025-04-24", "value": 125812}, {"date": "2025-04-25", "value": 110049}, {"date": "2025-04-26", "value": 118019}, {"date": "2025-04-27", "value": 123563}, {"date": "2025-04-28", "value": 133455}, {"date": "2025-04-29", "value": 145944}, {"date": "2025-04-30", "value": 125204}, {"date": "2025-05-01", "value": 107417}, {"date": "2025-05-02", "value": 122190}, {"date": "2025-05-03", "value": 109006}, {"date": "2025-05-04", "value": 111970}, {"date": "2025-05-05", "value": 127564}, {"date": "2025-05-06", "value": 146546}, {"date": "2025-05-07", "value": 135389}, {"date": "2025-05-08", "value": 126745}, {"date": "2025-05-09", "value": 130400}, {"date": "2025-05-10", "value": 107810}, {"date": "2025-05-11", "value": 108159}, {"date": "2025-05-12", "value": 139596}, {"date": "2025-05-13", "value": 138378}, {"date": "2025-05-14", "value": 131935}, {"date": "2025-05-15", "value": 132427}, {"date": "2025-05-16", "value": 125708}, {"date": "2025-05-17", "value": 132053}, {"date": "2025-05-18", "value": 121151}, {"date": "2025-05-19", "value": 155104}, {"date": "2025-05-20", "value": 173747}, {"date": "2025-05-21", "value": 189425}, {"date": "2025-05-22", "value": 200330}, {"date": "2025-05-23", "value": 168903}, {"date": "2025-05-24", "value": 171363}, {"date": "2025-05-25", "value": 182694}, {"date": "2025-05-26", "value": 177683}, {"date": "2025-05-27", "value": 183861}, {"date": "2025-05-28", "value": 156718}, {"date": "2025-05-29", "value": 143515}, {"date": "2025-05-30", "value": 111901}, {"date": "2025-05-31", "value": 109934}, {"date": "2025-06-01", "value": 99575}, {"date": "2025-06-02", "value": 126848}, {"date": "2025-06-03", "value": 154871}, {"date": "2025-06-04", "value": 136228}, {"date": "2025-06-05", "value": 131997}, {"date": "2025-06-06", "value": 133660}, {"date": "2025-06-07", "value": 128219}, {"date": "2025-06-08", "value": 115851}, {"date": "2025-06-09", "value": 139773}, {"date": "2025-06-10", "value": 139404}, {"date": "2025-06-11", "value": 138105}, {"date": "2025-06-12", "value": 146115}, {"date": "2025-06-13", "value": 133007}, {"date": "2025-06-14", "value": 108425}, {"date": "2025-06-15", "value": 109788}, {"date": "2025-06-16", "value": 124302}, {"date": "2025-06-17", "value": 122979}, {"date": "2025-06-18", "value": 124126}, {"date": "2025-06-19", "value": 107399}, {"date": "2025-06-20", "value": 118731}, {"date": "2025-06-21", "value": 118434}, {"date": "2025-06-22", "value": 118394}, {"date": "2025-06-23", "value": 148000}, {"date": "2025-06-24", "value": 137754}, {"date": "2025-06-25", "value": 150291}, {"date": "2025-06-26", "value": 125924}, {"date": "2025-06-27", "value": 134800}, {"date": "2025-06-28", "value": 124681}, {"date": "2025-06-29", "value": 120257}, {"date": "2025-06-30", "value": 143488}, {"date": "2025-07-01", "value": 148266}, {"date": "2025-07-02", "value": 149012}, {"date": "2025-07-03", "value": 142109}, {"date": "2025-07-04", "value": 120037}, {"date": "2025-07-05", "value": 139895}, {"date": "2025-07-06", "value": 122768}, {"date": "2025-07-07", "value": 140232}, {"date": "2025-07-08", "value": 134523}, {"date": "2025-07-09", "value": 130843}, {"date": "2025-07-10", "value": 129958}, {"date": "2025-07-11", "value": 126330}, {"date": "2025-07-12", "value": 130122}, {"date": "2025-07-13", "value": 130724}, {"date": "2025-07-14", "value": 118692}, {"date": "2025-07-15", "value": 134471}, {"date": "2025-07-16", "value": 143847}, {"date": "2025-07-17", "value": 128421}, {"date": "2025-07-18", "value": 116176}, {"date": "2025-07-19", "value": 122349}, {"date": "2025-07-20", "value": 120509}, {"date": "2025-07-21", "value": 143614}, {"date": "2025-07-22", "value": 156293}, {"date": "2025-07-23", "value": 151006}, {"date": "2025-07-24", "value": 152488}, {"date": "2025-07-25", "value": 141053}, {"date": "2025-07-26", "value": 113486}, {"date": "2025-07-27", "value": 129591}, {"date": "2025-07-28", "value": 132372}, {"date": "2025-07-29", "value": 125566}, {"date": "2025-07-30", "value": 118549}, {"date": "2025-07-31", "value": 133806}, {"date": "2025-08-01", "value": 126253}, {"date": "2025-08-02", "value": 131788}, {"date": "2025-08-03", "value": 125427}, {"date": "2025-08-04", "value": 138277}, {"date": "2025-08-05", "value": 135961}, {"date": "2025-08-06", "value": 134602}, {"date": "2025-08-07", "value": 132927}, {"date": "2025-08-08", "value": 123359}];

const $ = (sel) => document.querySelector(sel);
function fmt(d) { const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
function parseDateInput(el){ if(!el.value) return null; const [y,m,d]=el.value.split('-').map(Number); return new Date(y,m-1,d); }
function buildUrl(artistId) {
  const daysBack = parseInt($('#daysBack').value||'30',10);
  const toDateInput = parseDateInput($('#toDate'));
  const to = toDateInput || new Date(Date.now()-24*3600*1000);
  const toDate = fmt(to);
  let fromDate;
  if(FIXED_FROM){ fromDate = FIXED_FROM; }
  else { const from = new Date(to); from.setDate(from.getDate()-daysBack); fromDate = fmt(from); }
  return `https://artists.spotify.com/c/artist/${artistId}/audience/stats?fromDate=${fromDate}&toDate=${toDate}&metric=streams`;
}
function setYesterday(){ const y=new Date(); y.setDate(y.getDate()-1); $('#toDate').value=fmt(y); renderList(); }

function keyFor(id,dateStr){ return `nn:streams:${id}:${dateStr}`; }
function getDateStr(){ const d=parseDateInput($('#toDate')); const use = d||new Date(Date.now()-24*3600*1000); return fmt(use); }
function loadValue(id){ const v=localStorage.getItem(keyFor(id,getDateStr())); return v?Number(v):0; }
function saveValue(id,val){ localStorage.setItem(keyFor(id,getDateStr()), String(val||0)); updateGrandTotal(); updateChartFromStorage(); }
function updateGrandTotal(){ const sum=(ARTISTS||[]).reduce((a,x)=>a+(loadValue(x.id)||0),0); $('#grandTotal').textContent=sum.toLocaleString('nl-NL'); }

function openAll(){ (ARTISTS||[]).forEach(a=>window.open(buildUrl(a.id),'_blank')); }
function openSelected(){ document.querySelectorAll('input[type=checkbox][data-id]:checked').forEach(cb=>window.open(buildUrl(cb.dataset.id),'_blank')); }

function renderList(){
  const list=$('#artistList'); list.innerHTML='';
  (ARTISTS||[]).forEach(a=>{
    const row=document.createElement('div'); row.className='artist-row';
    const meta=document.createElement('div'); meta.className='artist-meta';
    meta.innerHTML=`<strong>${a.name}</strong><span class="muted">${a.id}</span>`;
    const input=document.createElement('input'); input.type='number'; input.placeholder='gisteren'; input.min='0'; input.step='1';
    input.value=loadValue(a.id)||''; input.oninput=()=>saveValue(a.id, Number(input.value||0));
    const actions=document.createElement('div'); actions.className='artist-actions';
    const cb=document.createElement('input'); cb.type='checkbox'; cb.dataset.id=a.id; cb.title='Selecteer';
    const link=document.createElement('a'); link.href=buildUrl(a.id); link.target='_blank'; link.textContent='Open dashboard'; link.className='pill';
    actions.appendChild(cb); actions.appendChild(link);
    const note=document.createElement('div'); note.className='muted';
    note.innerHTML = FIXED_FROM ? `Range: <code>${FIXED_FROM}</code> → <code>${($('#toDate').value || '(gisteren)')}</code>`
                                : `Range: <code>${($('#daysBack').value || '30')} dagen terug</code> → <code>${($('#toDate').value || '(gisteren)')}</code>`;
    row.appendChild(meta); row.appendChild(input); row.appendChild(actions); row.appendChild(note); list.appendChild(row);
  });
  updateGrandTotal();
}

// Chart utils
function toISO(dstr){ return new Date(dstr+'T00:00:00'); }
function isoWeek(d){ const tmp=new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dayNum=tmp.getUTCDay()||7; tmp.setUTCDate(tmp.getUTCDate()+4-dayNum); const yearStart=new Date(Date.UTC(tmp.getUTCFullYear(),0,1)); const weekNo=Math.ceil((((tmp - yearStart)/86400000)+1)/7); return [tmp.getUTCFullYear(), weekNo]; }
function mergeData(){
  const map = new Map(PRELOAD_DATA.map(x=>[x.date, x.value]));
  const dates = new Set(map.keys());
  for (let i=0; i<localStorage.length; i++) { const k=localStorage.key(i); if(!k.startsWith('nn:streams:')) continue; const d=k.split(':')[3]; if(/\d{4}-\d{2}-\d{2}/.test(d)) dates.add(d); }
  dates.forEach(d=>{ let s=0; (ARTISTS||[]).forEach(a=>{ const v=Number(localStorage.getItem(`nn:streams:${a.id}:${d}`)||0); if(!isNaN(v)) s+=v; }); if(s>0) map.set(d, s); });
  const out = Array.from(map.entries()).map(([date, value])=>({date, value})); out.sort((a,b)=> a.date.localeCompare(b.date)); return out;
}
function movingAvg7(arr){ const out=[]; const q=[]; let sum=0; for(let i=0;i<arr.length;i++){ q.push(arr[i].value); sum+=arr[i].value; if(q.length>7) sum-=q.shift(); out.push(q.length===7? Math.round(sum/7): null); } return out; }
function weeklyAverageSeries(arr){ const groups=new Map(); arr.forEach(pt=>{ const d=toISO(pt.date); const [y,w]=isoWeek(d); const k=`${y}-${w}`; if(!groups.has(k)) groups.set(k, []); groups.get(k).push(pt.value); }); const weekMean=new Map(); groups.forEach((vals,k)=>{ const m=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length); weekMean.set(k,m); }); return arr.map(pt=>{ const d=toISO(pt.date); const [y,w]=isoWeek(d); return weekMean.get(`${y}-${w}`); }); }
let chart;
function renderChart(){
  const data=mergeData(); const labels=data.map(d=>d.date); const daily=data.map(d=>d.value); const ma7=movingAvg7(data); const wk=null;
  const ctx=document.getElementById('streamsChart').getContext('2d'); if(chart) chart.destroy();
  
      const vals = daily.filter(v=>typeof v==='number');
      const minV = Math.min(...vals);
      const maxV = Math.max(...vals);
      const pad = Math.round((maxV - minV) * 0.1);
      const yMin = Math.max(0, minV - pad);
      const yMax = maxV + pad;

      chart=new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[
      { label:'Dagtotalen', data: daily, tension:0.2, borderWidth:3, pointRadius:0 },
      { label:'7-daags gemiddelde', data: ma7, tension:0.2, borderWidth:3, pointRadius:0 },
      { label:'Weekgemiddelde (ISO-week)', data: wk, stepped: true, borderWidth:3, pointRadius:0 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ labels:{ color:'#e6ecf5' } }, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${ctx.formattedValue}` } } },
      scales:{ x:{ ticks:{ color:'#93a3b8' }, grid:{ color:'rgba(255,255,255,0.05)' } }, y:{ min:yMin, max:yMax, ticks:{ color:'#93a3b8' }, grid:{ color:'rgba(255,255,255,0.07)' } } }
    }
  });
}
function updateChartFromStorage(){ renderChart(); }
function downloadCSV(){
  const data=mergeData(); const ma7=movingAvg7(data); const wk=null;
  let rows=[['Datum','Totaal','MA7']];
  for (let i=0;i<data.length;i++) rows.push([data[i].date, data[i].value, ma7[i] ?? '']);
  const csv = rows.map(r=>r.join(',')).join('\n');
  const blob=new Blob([csv], {type:'text/csv'}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='night-notes-dagtotaal.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function init(){
  setYesterday(); renderList(); renderChart();
  $('#openAll').addEventListener('click', openAll);
  $('#openSelected').addEventListener('click', openSelected);
  $('#setYesterday').addEventListener('click', setYesterday);
  $('#downloadCSV').addEventListener('click', downloadCSV);
  $('#daysBack').addEventListener('change', renderList);
  $('#toDate').addEventListener('change', renderList);
}
// Correct known data errors (Week 4 zondag -> 74.840)
// Correct known data errors (Week 4 zondag -> 74.840 op 2025-01-26)
PRELOAD_DATA = PRELOAD_DATA.map(p => (p.date === '2025-01-26' ? { ...p, value: 74840 } : p));

window.addEventListener('load', init);
