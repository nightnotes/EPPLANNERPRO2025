
/*! EP Planner — Releases realtime-ish sync (CSP-safe, no external libs) */
(function(){
  const PROJECT_ID = "night-notes-c92e3";
  const API_KEY = "AIzaSyDujrir7S_vNDfnNq0ZkcTMHKYxsN5Ba54";
  const DOC_PATH = "projects/"+PROJECT_ID+"/databases/(default)/documents/night-notes/releases";
  const BASE = "https://firestore.googleapis.com/v1/";

  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));

  function pill(text){
    let el = $(".cloud-status-pill");
    if(!el){
      el = document.createElement("div");
      el.className = "cloud-status-pill";
      Object.assign(el.style, {
        position:"fixed", right:"12px", bottom:"12px", zIndex:9999,
        background:"rgba(15,22,48,.9)", border:"1px solid #27365e",
        borderRadius:"999px", padding:"6px 10px", fontSize:"12px",
        fontFamily:"ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        color:"#a7b1d8"
      });
      document.body.appendChild(el);
    }
    if(text) el.textContent = text;
    return el;
  }

  function isoFromNLDate(s){
    const m = /(\d{2})-(\d{2})-(\d{4})/.exec(String(s||"").trim());
    if (!m) return String(s||"").trim();
    const [,dd,mm,yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }

  function findTable(){
    const tables = $$("table");
    for(const t of tables){
      const head = t.tHead || t.querySelector("thead");
      if(!head) continue;
      const labels = $$("th, td", head).map(el => (el.textContent||"").toLowerCase().trim());
      const ok = labels.some(x=>x.includes("datum")) && labels.some(x=>x.includes("artiest")) && labels.some(x=>x.includes("status"));
      if(ok) return t;
    }
    return null;
  }

  function getRows(table){
    const b = table?.tBodies?.[0] || table?.querySelector("tbody") || table;
    return $$("tr", b).filter(r => $$("td", r).length >= 5);
  }

  function cellText(td){ return (td?.textContent || "").trim(); }

  function keyForRow(row, idx){
    const tds = $$("td", row);
    const base = `${isoFromNLDate(cellText(tds[0]))}|${cellText(tds[1])}`;
    return base.length>1 ? base : `row#${idx}`;
  }

  function ensureDot(td){
    let dot = td.querySelector(".dot");
    if(!dot){
      dot = document.createElement("span");
      dot.className = "dot";
      Object.assign(dot.style, {
        display:"inline-block", width:"10px", height:"10px",
        borderRadius:"999px", marginInline:"6px", verticalAlign:"middle"
      });
      td.prepend(dot);
    }
    return dot;
  }

  function setDot(td, on){
    const d = ensureDot(td);
    d.style.background = on ? "rgb(34, 197, 94)" : "transparent";
    d.style.outline = on ? "1px solid rgba(34, 197, 94, .55)" : "1px solid rgba(255,255,255,.2)";
    d.title = on ? "Af • gesynchroniseerd" : "Nog niet af";
  }

  function getDot(td){
    const d = ensureDot(td);
    const bg = getComputedStyle(d).backgroundColor || "";
    return bg.includes("34, 197, 94");
  }

  function readDOM(){
    const t = findTable(); if(!t) return [];
    return getRows(t).map((r,i)=>{
      const tds = $$("td", r);
      return { key: keyForRow(r,i), done: getDot(tds[4]) };
    });
  }

  function applyState(list){
    const t = findTable(); if(!t) return;
    const rows = getRows(t);
    const map = new Map((list||[]).map(x=>[x.key, !!x.done]));
    rows.forEach((r,i)=>{
      const tds = $$("td", r);
      const k = keyForRow(r,i);
      const want = map.has(k) ? map.get(k) : getDot(tds[4]);
      setDot(tds[4], !!want);
    });
  }

  // ---- Firestore REST encoding/decoding helpers ----
  function toFirestoreValue(v){
    if (typeof v === "string") return { stringValue: v };
    if (typeof v === "boolean") return { booleanValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toFirestoreValue) } };
    if (v && typeof v === "object"){
      const fields = {};
      for (const [k,val] of Object.entries(v)) fields[k] = toFirestoreValue(val);
      return { mapValue: { fields } };
    }
    return { nullValue: null };
  }

  function encodeDocument(list){
    return { fields: { value: toFirestoreValue(list) } };
  }

  function fromFirestoreValue(v){
    if (!v) return null;
    if ("stringValue" in v) return v.stringValue;
    if ("booleanValue" in v) return !!v.booleanValue;
    if ("arrayValue" in v) return (v.arrayValue.values||[]).map(fromFirestoreValue);
    if ("mapValue" in v){
      const out = {};
      const f = v.mapValue.fields || {};
      for (const k of Object.keys(f)) out[k] = fromFirestoreValue(f[k]);
      return out;
    }
    return null;
  }

  async function fetchJSON(url, opts){
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  }

  async function getDoc(){
    try{
      const j = await fetchJSON(`${BASE}${DOC_PATH}?key=${API_KEY}`);
      const fields = j.fields || {};
      const raw = fields.value;
      const val = fromFirestoreValue(raw);
      return Array.isArray(val) ? val : [];
    }catch(e){
      if ((e.message||"").includes("404")) return null;
      throw e;
    }
  }

  async function setDoc(list){
    const body = JSON.stringify(encodeDocument(list));
    const url = `${BASE}${DOC_PATH}?key=${API_KEY}&currentDocument.exists=false`;
    try{
      await fetchJSON(url, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body });
    }catch(e){
      const u2 = `${BASE}${DOC_PATH}?key=${API_KEY}&updateMask.fieldPaths=value`;
      await fetchJSON(u2, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body });
    }
  }

  let saving = false;
  let lastApplied = null;
  let stop = false;

  async function loadOnce(){
    try{
      const list = await getDoc();
      if (list === null){
        await setDoc(readDOM());
        pill("Cloud: verbonden");
        return;
      }
      applyState(list);
      lastApplied = JSON.stringify(list);
      pill("Cloud: verbonden");
    }catch(e){
      pill("Cloud: offline");
    }
  }

  async function pollLoop(){
    while(!stop){
      await new Promise(r=>setTimeout(r, 2000));
      if (saving) continue;
      try{
        const list = await getDoc();
        const payload = JSON.stringify(Array.isArray(list)?list:[]);
        if (payload !== lastApplied){
          applyState(Array.isArray(list)?list:[]);
          lastApplied = payload;
        }
        pill("Cloud: verbonden");
      }catch(e){
        pill("Cloud: offline");
      }
    }
  }

  function attachClicks(){
    document.addEventListener("click", (ev)=>{
      const t = findTable(); if(!t) return;
      const td = ev.target instanceof Element ? ev.target.closest("td") : null;
      if (!td || !t.contains(td)) return;
      const r = td.closest("tr"); if(!r) return;
      const tds = $$("td", r);
      const isStatus = tds[4]===td || td.querySelector(".dot");
      if (!isStatus) return;
      setDot(tds[4], !getDot(tds[4]));
      (async()=>{
        try{
          saving = true;
          const list = readDOM();
          await setDoc(list);
          lastApplied = JSON.stringify(list);
          saving = false;
          pill("Cloud: verbonden");
        }catch(e){
          saving = false;
          pill("Cloud: offline");
        }
      })();
    });
  }

  pill("Cloud: verbinden…");
  (async()=>{
    let tries=0; while(!findTable() && tries<50){ await new Promise(r=>setTimeout(r,200)); tries++; }
    await loadOnce();
    attachClicks();
    pollLoop();
  })();

  new MutationObserver(()=>{
    if (lastApplied){
      try { applyState(JSON.parse(lastApplied)||[]); } catch {}
    }
  }).observe(document.documentElement, {childList:true, subtree:true});
})();
