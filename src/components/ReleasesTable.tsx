
import { useMemo, useRef, useEffect, useState } from 'react'
import { ReleaseRow } from '../utils/schedule'

type Props = { rows: ReleaseRow[] }
type TaskState = { splits?: boolean; buma?: boolean; done?: boolean }
const KEY = 'releaseStates'

function loadStates(): Record<string, TaskState> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function saveStates(s: Record<string, TaskState>) {
  localStorage.setItem(KEY, JSON.stringify(s))
}
function idFor(r: ReleaseRow){ return `${r.date}_${r.artist}` }


const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

export default function ReleasesTable({ rows }: Props) {
  const states = useMemo(()=>loadStates(), [rows.length])
  useEffect(()=>{
    (async ()=>{
      const cloud = await loadReleasesStatus();
      if (cloud && typeof cloud === 'object') {
        saveStates(cloud);
        requestAnimationFrame(()=>window.dispatchEvent(new Event('storage')));
      }
    })();
  }, [])
  useEffect(()=>{
    const onStorage = () => setRenderTick(t=>t+1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [])



  function setDone(id: string, val: boolean) {
    const s = loadStates()
    s[id] = { ...(s[id]||{}), done: val }
    saveStates(s)
    saveReleasesStatus(s)
    setRenderTick(t=>t+1)
    // force a repaint by updating a benign key (cheap trick)
    requestAnimationFrame(()=>window.dispatchEvent(new Event('storage')))
  }

  function useLongPress(id: string) {
    const timer = useRef<number | null>(null)
    const start = () => {
      if (timer.current) return
      // 3s long-press
      timer.current = window.setTimeout(() => {
        setDone(id, false)
        timer.current = null
      }, 3000)
    }
    const cancel = () => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
    }
    return {
      onMouseDown: start, onMouseUp: cancel, onMouseLeave: cancel,
      onTouchStart: start, onTouchEnd: cancel, onTouchCancel: cancel
    }
  }

  return (
    <div className="card max-w-6xl mx-auto mt-4 overflow-hidden fade-in glow">
      <div className="px-6 py-4 border-b border-nn_border/70">
        <div className="text-lg font-semibold">Releases</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="table-head">
            <tr className="text-left">
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Artiest</th>
              <th className="px-4 py-3">Wie?</th>
              <th className="px-4 py-3">Distributie</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="px-4 py-6 text-nn_muted" colSpan={5}>Geen items.</td></tr>
            ) : rows.map((r, i) => {
              const s = states[idFor(r)]
              const green = !!s?.done
              const id = idFor(r)
              return (
                <tr key={i} className="border-t border-nn_border/50 hover:bg-nn_bg2/30">
                  <td className="px-4 py-2 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-2">{r.artist}</td>
                  <td className="px-4 py-2">{r.who}</td>
                  <td className="px-4 py-2">{r.distribution}</td>
                  <td className="px-4 py-2">
                    <span
                      className={"inline-block w-3 h-3 rounded-full cursor-pointer select-none " + (green ? "bg-green-500" : "bg-red-500")}
                      title={green ? "Ingedrukt houden om ongedaan te maken" : "Nog niet klaar"}
                      onClick={()=>setDone(id, !green)} {...useLongPress(id)}
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
