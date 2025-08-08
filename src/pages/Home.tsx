
import Navbar from '../components/Navbar'
import { useMemo, useState } from 'react'
import ReleasesTable from '../components/ReleasesTable'
import { generateSchedule } from '../utils/schedule'

export default function Home() {
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth()+n, 1);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const allRows = generateSchedule(new Date("2025-08-25"), new Date("2026-12-31"))
  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2,'0')}`
  const rows = useMemo(() => allRows.filter(r => r.date.startsWith(monthKey)), [allRows, monthKey])
  return (
    <div>
      <Navbar />
      <div className="section">
        <div className="hero flex items-center justify-between gap-4 flex-wrap">
          <div>
          <h1>Volledige planning</h1>
          <p className="subtle mt-2">Tip: houd <b>3 seconden</b> ingedrukt op een <span className="inline-block w-3 h-3 rounded-full bg-green-500 align-middle"></span> groen bolletje om ’m terug op rood te zetten.</p>
        </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary px-3 py-1.5" onClick={()=>setCurrentMonth(m=>addMonths(m,-1))}>◀</button>
            <div className="px-3 py-1.5 rounded-xl bg-nn_bg2/60 border border-nn_border/70 font-semibold">{currentMonth.toLocaleString('nl-NL', { month:'long', year:'numeric' })}</div>
            <button className="btn-primary px-3 py-1.5" onClick={()=>setCurrentMonth(m=>addMonths(m,1))}>▶</button>
          </div>
        <ReleasesTable rows={rows} />
      </div>
    </div>
  )
}
