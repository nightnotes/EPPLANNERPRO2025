
    const ARTISTS = {ARTISTS_JSON};
    const FIXED_FROM = '';
    const PRELOAD_DATA = {PRELOAD_JSON}; // [{{date:'YYYY-MM-DD', value:Number}}, ...]

    const $ = (sel) => document.querySelector(sel);
    function fmt(d) {{ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${{y}}-${{m}}-${{day}}`; }}
    function parseDateInput(el){{ if(!el.value) return null; const [y,m,d]=el.value.split('-').map(Number); return new Date(y,m-1,d); }}
    function buildUrl(artistId) {{
      const daysBack = parseInt($('#daysBack').value||'30',10);
      const toDateInput = parseDateInput($('#toDate'));
      const to = toDateInput || new Date(Date.now()-24*3600*1000);
      const toDate = fmt(to);
      let fromDate;
      if(FIXED_FROM){{ fromDate = FIXED_FROM; }}
      else {{ const from = new Date(to); from.setDate(from.getDate()-daysBack); fromDate = fmt(from); }}
      return `https://artists.spotify.com/c/artist/${{artistId}}/audience/stats?fromDate=${{fromDate}}&toDate=${{toDate}}&metric=streams`;
    }}
    function setYesterday(){{ const y=new Date(); y.setDate(y.getDate()-1); $('#toDate').value=fmt(y); renderList(); }}

    function keyFor(id,dateStr){{ return `nn:streams:${{id}}:${{dateStr}}`; }}
    function getDateStr(){{ const d=parseDateInput($('#toDate')); const use = d||new Date(Date.now()-24*3600*1000); return fmt(use); }}
    function loadValue(id){{ const v=localStorage.getItem(keyFor(id,getDateStr())); return v?Number(v):0; }}
    function saveValue(id,val){{ localStorage.setItem(keyFor(id,getDateStr()), String(val||0)); updateGrandTotal(); updateChartFromStorage(); }}
    function updateGrandTotal(){{ const sum=ARTISTS.reduce((a,x)=>a+(loadValue(x.id)||0),0); $('#grandTotal').textContent=sum.toLocaleString('nl-NL'); }}

    function openAll(){{ ARTISTS.forEach(a=>window.open(buildUrl(a.id),'_blank')); }}
    function openSelected(){{ document.querySelectorAll('input[type=checkbox][data-id]:checked').forEach(cb=>window.open(buildUrl(cb.dataset.id),'_blank')); }}

    function renderList(){{
      const list=$('#artistList'); list.innerHTML='';
      ARTISTS.forEach(a=>{{
        const row=document.createElement('div'); row.className='artist-row';
        const meta=document.createElement('div'); meta.className='artist-meta';
        meta.innerHTML=`<strong>${{a.name}}</strong><span class="muted">${{a.id}}</span>`;
        const input=document.createElement('input'); input.type='number'; input.placeholder='gisteren'; input.min='0'; input.step='1';
        input.value=loadValue(a.id)||''; input.oninput=()=>saveValue(a.id, Number(input.value||0));
        const actions=document.createElement('div'); actions.className='artist-actions';
        const cb=document.createElement('input'); cb.type='checkbox'; cb.dataset.id=a.id; cb.title='Selecteer voor "Open geselecteerde"';
        const link=document.createElement('a'); link.href=buildUrl(a.id); link.target='_blank'; link.textContent='Open dashboard'; link.className='pill';
        actions.appendChild(cb); actions.appendChild(link);
        const note=document.createElement('div'); note.className='muted';
        note.innerHTML = FIXED_FROM ? `Range: <code>${{FIXED_FROM}}</code> → <code>${{($('#toDate').value || '(gisteren)')}}</code>`
                                    : `Range: <code>${{($('#daysBack').value || '30')}} dagen terug</code> → <code>${{($('#toDate').value || '(gisteren)')}}</code>`;
        row.appendChild(meta); row.appendChild(input); row.appendChild(actions); row.appendChild(note); list.appendChild(row);
      }});
      updateGrandTotal();
    }}

    // === Chart helpers ===
    function toISO(dstr){{ return new Date(dstr+'T00:00:00'); }}
    function isoWeek(d){{ const tmp=new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dayNum=tmp.getUTCDay()||7; tmp.setUTCDate(tmp.getUTCDate()+4-dayNum); const yearStart=new Date(Date.UTC(tmp.getUTCFullYear(),0,1)); const weekNo=Math.ceil((((tmp - yearStart)/86400000)+1)/7); return [tmp.getUTCFullYear(), weekNo]; }}

    function mergeData(){{
      const map = new Map(PRELOAD_DATA.map(x=>[x.date, x.value]));
      const dates = new Set(map.keys());
      for (let i=0; i<localStorage.length; i++) {{ const k=localStorage.key(i); if(!k.startsWith('nn:streams:')) continue; const d=k.split(':')[3]; if(/\d{{4}}-\d{{2}}-\d{{2}}/.test(d)) dates.add(d); }}
      dates.forEach(d=>{{ let s=0; ARTISTS.forEach(a=>{{ const v=Number(localStorage.getItem(`nn:streams:${{a.id}}:${{d}}`)||0); if(!isNaN(v)) s+=v; }}); if(s>0) map.set(d, s); }});
      const out = Array.from(map.entries()).map(([date, value])=>({{date, value}})); out.sort((a,b)=> a.date.localeCompare(b.date)); return out;
    }}

    function movingAvg7(arr){{ const out=[]; const q=[]; let sum=0; for(let i=0;i<arr.length;i++){{ q.push(arr[i].value); sum+=arr[i].value; if(q.length>7) sum-=q.shift(); out.push(q.length===7? Math.round(sum/7): null); }} return out; }}
    function weeklyAverageSeries(arr){{ const groups=new Map(); arr.forEach(pt=>{{ const d=toISO(pt.date); const [y,w]=isoWeek(d); const k=`${{y}}-${{w}}`; if(!groups.has(k)) groups.set(k, []); groups.get(k).push(pt.value); }}); const weekMean=new Map(); groups.forEach((vals,k)=>{{ const m=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length); weekMean.set(k,m); }}); return arr.map(pt=>{{ const d=toISO(pt.date); const [y,w]=isoWeek(d); return weekMean.get(`${{y}}-${{w}}`); }}); }}

    let chart;
    function renderChart(){{
      const data=mergeData(); const labels=data.map(d=>d.date); const daily=data.map(d=>d.value); const ma7=movingAvg7(data); const wk=weeklyAverageSeries(data);
      const ctx=document.getElementById('streamsChart').getContext('2d'); if(chart) chart.destroy();
      chart=new Chart(ctx, {{
        type:'line',
        data:{{ labels, datasets:[
          {{ label:'Dagtotalen', data: daily, tension:0.2, borderWidth:2, pointRadius:0 }},
          {{ label:'7-daags gemiddelde', data: ma7, tension:0.2, borderWidth:2, pointRadius:0 }},
          {{ label:'Weekgemiddelde (ISO-week)', data: wk, stepped: true, borderWidth:2, pointRadius:0 }}
        ]}},
        options:{{
          responsive:true, maintainAspectRatio:false, interaction:{{ mode:'index', intersect:false }},
          plugins:{{ legend:{{ labels:{{ color:'#e6ecf5' }} }}, tooltip:{{ callbacks:{{ label:(ctx)=> `${{ctx.dataset.label}}: ${{ctx.formattedValue}}` }} }} }},
          scales:{{ x:{{ ticks:{{ color:'#93a3b8' }}, grid:{{ color:'rgba(255,255,255,0.05)' }} }}, y:{{ ticks:{{ color:'#93a3b8' }}, grid:{{ color:'rgba(255,255,255,0.07)' }} }} }}
        }}
      }});
    }}

    function updateChartFromStorage(){{ renderChart(); }}

    function downloadCSV(){{
      const data=mergeData(); const ma7=movingAvg7(data); const wk=weeklyAverageSeries(data);
      let rows=[['Datum','Totaal','MA7','Weekgem']];
      for (let i=0;i<data.length;i++) rows.push([data[i].date, data[i].value, ma7[i] ?? '', wk[i] ?? '']);
      const csv = rows.map(r=>r.join(',')).join('\n');
      const blob=new Blob([csv], {{type:'text/csv'}}); const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download='night-notes-dagtotaal.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    }}

    function init(){{ setYesterday(); renderList(); renderChart(); }}
    window.addEventListener('load', init);
    $('#daysBack').addEventListener('change', renderList);
    $('#toDate').addEventListener('change', renderList);
  