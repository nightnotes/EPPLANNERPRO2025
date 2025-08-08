
import Navbar from '../components/Navbar'
import ReleasesTable from '../components/ReleasesTable'
import { generateSchedule } from '../utils/schedule'

export default function Home() {
  // Full plan visible to both
  const rows = generateSchedule(new Date("2025-08-25"), new Date("2026-12-31"))
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-semibold mb-4">Volledige planning</h1>
        <ReleasesTable rows={rows} />
      </div>
    </div>
  )
}
