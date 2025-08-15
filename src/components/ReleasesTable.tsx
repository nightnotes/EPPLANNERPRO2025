
import { useRef, useState, useEffect, useMemo } from 'react'
import { ReleaseRow } from '../utils/schedule'
import { showToast } from './Toast'

type Props = { rows: ReleaseRow[] }
type TaskState = { done?: boolean }
const KEY = 'releaseStates'

function loadStates(): Record<string, TaskState> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function saveStates(s: Record<string, TaskState>) {
  localStorage.setItem(KEY, JSON.stringify(s))
}
function idFor(r: ReleaseRow){ return `${r.date}_${r.artist}` }
function monthKey(d: string) { return d.slice(0,7) } // YYYY-MM

export default function ReleasesTable({ rows }: Props) {
  const [states, setStates] = useState<Record<string, TaskState>>({})
  const [cloudOK, setCloudOK] = useState<boolean | null>(null)
  const [month, setMonth] = useState<string>('all')

  // Load local
  useEffect(()=>{
    setStates(loadStates());
  }, [rows.length])

  // Poll shared cloud state to keep all users in sync
  useEffect(()=>{
    let stop = false;
    async function tick(){
      if (stop) return;
      try {
        const r = await fetch('/.netlify/functions/kv-store?key=releases-status', { cache: 'no-store' });
        const j = await r.json();
        if (j && typeof j.value === 'object' && j.value) {
          const cloud = j.value;
          // Only update if changed to avoid loops
          try {
            const local = loadStates();
            if (JSON.stringify(local) !== JSON.stringify(cloud)) {
              saveStates(cloud);
              setStates(cloud);
            }
          } catch {
            saveStates(cloud);
            setStates(cloud);
          }
          setCloudOK(true);
        }
      } catch (e) {
        setCloudOK(false);
      } finally {
        if (!stop) setTimeout(tick, 5000); // 5s polling
      }
    }
    tick();
    return () => { stop = true; };
  }, []);

  // Load cloud on mount

  useEffect(()=>{
    (async ()=>{
      try {
        const r = await fetch('/.netlify/functions/kv-store?key=releases-status')
        const j = await r.json()
        if (j?.value) {
          saveStates(j.value)
          setStates(j.value)
          setCloudOK(true)
        } else {
          setCloudOK(true)
        }
      } catch { setCloudOK(false) }
    })()
  }, [])

  // Keep in sync across tabs
  useEffect(()=>{
    const onStorage = () => setStates(loadStates())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function setDone(id: string, done: boolean, silent=false) {
    const current = loadStates()
    const prev = current[id] || {}
    const nextAll = { ...current, [id]: { ...prev, done } }
    saveStates(nextAll)
    setStates(nextAll)
    // cloud (fire&forget)
    fetch('/.netlify/functions/kv-store?key=releases-status', {
      method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(nextAll)
    }).then(()=>{ setCloudOK(true); if(!silent) showToast('Opgeslagen ✅') }).catch(()=> setCloudOK(false))
  }

  function useLongPress(id: string) {
    const timer = useRef<number | null>(null)
    const start = () => {
      if (timer.current) return
      timer.current = window.setTimeout(() => { setDone(id, false); timer.current = null }, 2000) // 2s undo
    }
    const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null } }
    return { onMouseDown:start, onMouseUp:cancel, onMouseLeave:cancel, onTouchStart:start, onTouchEnd:cancel, onTouchCancel:cancel }
  }

  const months = useMemo(() => {
    const set = new Set<string>()
    rows.forEach(r => set.add(monthKey(r.date)))
    return ['all', ...Array.from(set).sort()]
  }, [rows])

  const filteredRows = month==='all' ? rows : rows.filter(r => monthKey(r.date)===month)

  function bulkSetMonthDone(flag: boolean) {
    const current = loadStates()
    const next = { ...current }
    filteredRows.forEach(r => { next[idFor(r)] = { ...(next[idFor(r)]||{}), done: flag } })
    saveStates(next)
    setStates(next)
    fetch('/.netlify/functions/kv-store?key=releases-status', {
      method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(next)
    }).then(()=>{ setCloudOK(true); showToast(flag ? 'Maand gemarkeerd ✅' : 'Maand gereset 🔄') }).catch(()=> setCloudOK(false))
  }

  return (
    <div className="card max-w-6xl mx-auto mt-4 overflow-hidden fade-in glow">
      <div className="px-6 py-4 border-b border-nn_border/70 flex items-center justify-between gap-3">
        <div className="text-lg font-semibold">Releases</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:inline text-nn_muted">Legenda:</span>
          <span className="inline-flex items-center gap-1"><i className="w-3 h-3 rounded-full bg-green-500 inline-block" /> klaar</span>
          <span className="inline-flex items-center gap-1"><i className="w-3 h-3 rounded-full bg-red-500 inline-block" /> open</span>
          <span className="text-nn_muted">• houd 2s ingedrukt voor undo</span>
          <span className={`ml-3 px-2 py-1 rounded border ${cloudOK===false ? 'border-red-500/50 text-red-300' : 'border-emerald-600/40 text-emerald-300'}`}>
            Cloud: {cloudOK===false ? 'offline' : 'verbonden'}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-wrap items-center gap-2">
        <label className="text-sm text-nn_muted">Filter maand:
          <select className="ml-2 bg-nn_bg2 border border-nn_border rounded px-2 py-1" value={month} onChange={e=>setMonth(e.target.value)}>
            {months.map(m => <option key={m} value={m}>{m==='all' ? 'Alle' : m}</option>)}
          </select>
        </label>
        <div className="ml-auto flex gap-2">
          <button className="btn btn-primary" onClick={()=>bulkSetMonthDone(true)}>Alles groen (maand)</button>
          <button className="btn" onClick={()=>bulkSetMonthDone(false)}>Reset maand</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="table-head sticky top-0 bg-nn_bg1/80 backdrop-blur">
            <tr className="text-left">
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Artiest</th>
              <th className="px-4 py-3">Wie?</th>
              <th className="px-4 py-3">Distributie</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr><td className="px-4 py-6 text-nn_muted" colSpan={5}>Geen items.</td></tr>
            ) : filteredRows.map((r, i) => {
              const id = idFor(r)
              const s = states[id]
              const green = !!s?.done
              return (
                <tr key={i} className="border-t border-nn_border/50 hover:bg-nn_bg2/30 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-2">{r.artist}</td>
                  <td className="px-4 py-2">{r.who}</td>
                  <td className="px-4 py-2">{r.distribution}</td>
                  <td className="px-4 py-2">
                    <span
                      className={"inline-block w-3 h-3 rounded-full cursor-pointer select-none transition-transform " + (green ? "bg-green-500" : "bg-red-500")}
                      title={green ? "Houd 2s ingedrukt voor undo" : "Klik om te markeren"}
                      onClick={()=>{ setDone(id, !green); }}
                      {...useLongPress(id)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
