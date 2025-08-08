import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import ReleasesTable from '../components/ReleasesTable'
import { generateSchedule } from '../utils/schedule'

export default function Home() {
  // Helpers for month navigation
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
  const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)

  // Current month state
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()))

  // Build full schedule once
  const allRows = useMemo(
    () => generateSchedule(new Date('2025-08-25'), new Date('2026-12-31')),
    []
  )

  // Build month options from data
  const monthOptions = useMemo(() => {
    const set = new Set<string>()
    for (const r of allRows) {
      set.add(r.date.slice(0, 7)) // YYYY-MM
    }
    return Array.from(set).sort()
  }, [allRows])

  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`

  const rows = useMemo(
    () => allRows.filter(r => r.date.startsWith(monthKey)),
    [allRows, monthKey]
  )

  const onSelectMonth = (key: string) => {
    const [y, m] = key.split('-').map(Number)
    setCurrentMonth(new Date(y, (m ?? 1) - 1, 1))
  }

  return (
    <>
      <Navbar />
      <div className="section">
        <div className="hero flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold">Releases</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn-primary px-3 py-1.5"
              onClick={() => setCurrentMonth(m => addMonths(m, -1))}
              aria-label="Vorige maand"
            >
              ◀
            </button>

            <select
              className="rounded-xl bg-nn_bg2/60 border border-nn_border/70 px-3 py-1.5 font-semibold"
              value={monthKey}
              onChange={(e) => onSelectMonth(e.target.value)}
            >
              {monthOptions.map(key => (
                <option key={key} value={key}>
                  {new Date(`${key}-01`).toLocaleString('nl-NL', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>

            <button
              className="btn-primary px-3 py-1.5"
              onClick={() => setCurrentMonth(m => addMonths(m, 1))}
              aria-label="Volgende maand"
            >
              ▶
            </button>
          </div>
        </div>

        <ReleasesTable rows={rows} />
      </div>
    </>
  )
}
