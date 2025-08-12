import React from 'react'
import Navbar from '../components/Navbar'
import ReleasesTable from '../components/ReleasesTable'
import { generateSchedule } from '../utils/schedule'

export default function Home() {
  const rows = generateSchedule(new Date('2025-08-25'), new Date('2026-12-31'))
  return (
    <>
      <Navbar />
      <div className="section">
        <h2 className="text-2xl font-bold mb-4">Releases</h2>
        <ReleasesTable rows={rows} />
      </div>
    </>
  )
}
