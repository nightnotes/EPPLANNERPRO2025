
import Navbar from '../components/Navbar'
import ReleasesTable from '../components/ReleasesTable'
import { generateSchedule } from '../utils/schedule'

export default function Home() {
  const rows = generateSchedule(new Date("2025-08-25"), new Date("2026-12-31"))
  return (
    <div>
      <Navbar />
      <div className="section">
        <div className="hero">
          <h1>Volledige planning</h1>
          <p className="subtle mt-2">Tip: houd <b>3 seconden</b> ingedrukt op een <span className="inline-block w-3 h-3 rounded-full bg-green-500 align-middle"></span> groen bolletje om ’m terug op rood te zetten.</p>
        </div>
        <ReleasesTable rows={rows} />
      </div>
    </div>
  )
}
