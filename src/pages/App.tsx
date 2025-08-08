
import { Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from '../utils/auth'
import Login from './Login'
import Home from './Home'
import EPChecklist from './EPChecklist'
import Artworks from './Artworks'
import Ads from './Ads'

export default function App() {
  const user = getUser()
  if (!user) return <Login />
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/ep-checklist" element={<EPChecklist />} />
    <Route path="/artworks" element={<Artworks />} />
    <Route path="/ads" element={<Ads />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
