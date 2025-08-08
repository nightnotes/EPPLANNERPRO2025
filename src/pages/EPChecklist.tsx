
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import { generateSchedule, ReleaseRow } from '../utils/schedule'

type TaskRow = ReleaseRow & { id: string; splits: boolean; buma: boolean; done: boolean }

const KEY = 'releaseStates'
const LAST = 'lastCompleted'

function loadStates(): Record<string, Partial<TaskRow>> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function saveStates(s: Record<string, Partial<TaskRow>>) {
  localStorage.setItem(KEY, JSON.stringify(s))
}
function setLastCompleted(id: string){ localStorage.setItem(LAST, id || '') }
function getLastCompleted(){ return localStorage.getItem(LAST) || '' }
function toId(r: ReleaseRow){ return `${r.date}_${r.artist}` }

export default function EPChecklist(){
  const start = new Date("2025-08-25")
  const endW = new Date(); endW.setDate(endW.getDate()+44) // 45 dagen window
  const baseAll = useMemo(()=>generateSchedule(start, endW),[])
  const [rows, setRows] = useState<TaskRow[]>([])

  const user = (localStorage.getItem('epplanner:user') || '') as any

  useEffect(()=>{
    const st = loadStates()
    const mapped = baseAll
      .filter(r=>r.who===user)
      .map(r=>{
        const id = toId(r)
        const s = st[id] || {}
        return { ...r, id, splits: !!s.splits, buma: !!s.buma, done: !!s.done }
      })
    setRows(mapped)
  }, [baseAll.length, user])

  const pending = rows.filter(r=>!r.done)
  const next = pending[0]

  const total = rows.length
  const doneCount = rows.filter(r=>r.done).length
  const pct = total ? Math.round(doneCount/total*100) : 0

  function persist(t: TaskRow, justCompleted: boolean){
    const st = loadStates()
    st[t.id] = { splits: t.splits, buma: t.buma, done: t.done }
    saveStates(st)
    if (justCompleted) setLastCompleted(t.id)
  }
  function toggle(key: 'splits'|'buma'|'done'){
    if (!next) return
    
const newVal = !(next as any)[key]
let updated = { ...next, [key]: newVal } as TaskRow
// If user tries to set 'done' to true but prerequisites not met, block it
if (key === 'done' && newVal === true && !(updated.splits && updated.buma)) {
  return
}
// If any prerequisite unchecked, ensure done=false
if (key !== 'done' && (!updated.splits || !updated.buma)) {
  updated.done = false
}
// Allow unchecking done any time
if (key === 'done' && newVal === false) {
  updated.done = false
}
persist(updated, key==='done' && updated.done)

    setRows(rs=>rs.map(r=> r.id===updated.id ? updated : r))
  }

  const lastId = getLastCompleted()
  const last = rows.find(r=>r.id===lastId)

  
function restoreLast(){
  if(!last) return;
  // Zet de laatste taak terug in de queue
  const updated = [...tasks, { ...last, done:false }];
  setTasks(updated);
  setLast(null);
}

return (
    <div>
      <Navbar />
      
<div className="section pt-6">
  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
    {/* Sidebar quick links */}
    <aside className="md:col-span-3">
      <div className="card p-4 sticky top-20">
        <div className="text-sm text-nn_muted mb-2">Snel naar</div>
        <div className="flex flex-col gap-2">
          <a className="tab tab-active text-center" href="https://distrokid.com/new/" target="_blank" rel="noreferrer">DistroKid</a>
          <a className="tab tab-active text-center" href="https://artist.amuse.io/studio" target="_blank" rel="noreferrer">Amuse</a>
          <a className="tab tab-active text-center" href="https://mijn.bumastemra.nl/" target="_blank" rel="noreferrer">Buma/Stemra</a>
        </div>
      </div>
    </aside>

    {/* Main content */}
    <main className="md:col-span-9 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">EP Checklist</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-nn_muted">{doneCount}/{total}</span>
          <progress max={100} value={pct} aria-label="voortgang"></progress>
        </div>
      </div>

      <div className="card p-5 fade-in">
        <div className="text-sm text-nn_muted mb-3">Volgende taak voor <b>{user}</b></div>
        {!next ? (
          <div className="text-nn_muted">Geen openstaande taken 🎉</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center">
            <div className="lg:col-span-4 font-medium">{next.date} — <b>{next.artist}</b></div>
            <div className="lg:col-span-2">{next.who}</div>
            <div className="lg:col-span-2">{next.distribution}</div>
            <div className="lg:col-span-4">
              <div className="flex justify-center gap-3">
                <button className={"round-toggle " + (next.splits ? "on" : "")} onClick={()=>toggle('splits')} aria-pressed={next.splits}>Splits</button>
                <button className={"round-toggle " + (next.buma ? "on" : "")} onClick={()=>toggle('buma')} aria-pressed={next.buma}>Buma/Stemra</button>
                <button className={"round-toggle " + (next.done ? "on" : "")} disabled={!(next.splits && next.buma)} onClick={()=>toggle('done')} aria-pressed={next.done}>Klaar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card p-5 fade-in">
        <div className="font-semibold mb-2">Laatst afgerond</div>
        
{!last ? <div className="text-nn_muted">Nog niks afgerond.</div> :
  <div className="flex items-center justify-between">
    <span>{last.date} — <b>{last.artist}</b> ({last.distribution})</span>
    <button
      className="px-3 py-1 rounded-full bg-nn_accent text-white hover:opacity-90 text-sm"
      onClick={()=>restoreLast()}
    >
      Herstel
    </button>
  </div>
}

