
import { useMemo } from 'react'
import { ReleaseRow } from '../utils/schedule'

type Props = { rows: ReleaseRow[] }
type TaskState = { splits?: boolean; buma?: boolean; done?: boolean }
const KEY = 'releaseStates'

function loadStates(): Record<string, TaskState> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function idFor(r: ReleaseRow){ return `${r.date}_${r.artist}` }

export default function ReleasesTable({ rows }: Props) {
  const states = useMemo(()=>loadStates(), [rows.length])
  return (
    <div className="card max-w-6xl mx-auto mt-6 overflow-hidden fade-in">
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
              return (
                <tr key={i} className="border-t border-nn_border/50 hover:bg-nn_bg2/30">
                  <td className="px-4 py-2 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-2">{r.artist}</td>
                  <td className="px-4 py-2">{r.who}</td>
                  <td className="px-4 py-2">{r.distribution}</td>
                  <td className="px-4 py-2">
                    <span className={"inline-block w-3 h-3 rounded-full " + (green ? "bg-green-500" : "bg-red-500")} />
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
