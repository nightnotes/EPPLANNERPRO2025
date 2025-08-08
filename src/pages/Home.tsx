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

  // Build full schedule once, then filter per month
  const allRows = useMemo(
    () => generateSchedule(new Date('2025-08-25'), new Date('2026-12-31')),
    []
  )

  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
  const rows = useMemo(
    () => allRows.filter(r => r.date.startsWith(monthKey)),
    [allRows, monthKey]
  )

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
            <div className="px-3 py-1.5 rounded-xl bg-nn_bg2/60 border border-nn_border/70 font-semibold">
              {currentMonth.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })}
            </div>
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
