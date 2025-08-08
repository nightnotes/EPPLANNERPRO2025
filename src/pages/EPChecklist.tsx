
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
    const updated = { ...next, [key]: !(next as any)[key] } as TaskRow
    if (key !== 'done' && (!updated.splits || !updated.buma)) updated.done = false
    persist(updated, key==='done' && updated.done)
    setRows(rs=>rs.map(r=> r.id===updated.id ? updated : r))
  }

  const lastId = getLastCompleted()
  const last = rows.find(r=>r.id===lastId)

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">EP Checklist</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-nn_muted">{doneCount}/{total}</span>
            <progress max={100} value={pct} aria-label="voortgang"></progress>
          </div>
        </div>

        <div className="card p-6 fade-in">
          <div className="text-sm text-nn_muted mb-3">Snel naar</div>
          <div className="flex flex-wrap gap-2">
            <a className="tab tab-active" href="https://distrokid.com/new/" target="_blank" rel="noreferrer">DistroKid</a>
            <a className="tab tab-active" href="https://artist.amuse.io/studio" target="_blank" rel="noreferrer">Amuse</a>
            <a className="tab tab-active" href="https://mijn.bumastemra.nl/" target="_blank" rel="noreferrer">Buma/Stemra</a>
          </div>
        </div>

        <div className="card p-6 fade-in">
          <div className="text-sm text-nn_muted mb-3">Volgende taak voor <b>{user}</b></div>
          {!next ? (
            <div className="text-nn_muted">Geen openstaande taken 🎉</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-center">
              <div className="sm:col-span-2">{next.date} — <b>{next.artist}</b></div>
              <div>{next.who}</div>
              <div>{next.distribution}</div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={next.splits} onChange={()=>toggle('splits')} /> Splits</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={next.buma} onChange={()=>toggle('buma')} /> Buma/Stemra</label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={next.done} disabled={!(next.splits && next.buma)} onChange={()=>toggle('done')} /> Klaar
              </label>
            </div>
          )}
        </div>

        <div className="card p-6 fade-in">
          <div className="font-semibold mb-2">Laatst afgerond</div>
          {!last ? <div className="text-nn_muted">Nog niks afgerond.</div> :
            <div>{last.date} — <b>{last.artist}</b> ({last.distribution})</div>
          }
        </div>
      </div>
    </div>
  )
}
