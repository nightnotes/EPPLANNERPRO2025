
import { NavLink } from 'react-router-dom'
import { logout, getUser } from '../utils/auth'

export default function Navbar() {
  const user = getUser();
  return (
    <div className="w-full sticky top-0 z-50 bg-nn_bg1/80 backdrop-blur border-b border-nn_border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo-nightnotes.png" alt="Night Notes" className="h-12 sm:h-14 w-auto" />
          <nav className="ml-2 hidden sm:flex gap-2">
            <NavLink to="/" className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>RELEASES</NavLink>
            <NavLink to="/ep-checklist" className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>EP CHECKLIST</NavLink>
            <NavLink to="/artworks" className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>ARTWORKS</NavLink>
            <NavLink to="/ads" className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>ADVERTENTIEBEHEER</NavLink>
                      <NavLink to="/streams" className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>STREAMS</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-nn_muted">Welkom {user}</div>
          <button className="tab" onClick={() => { logout(); location.href = '/'; }}>Log out</button>
        </div>
      </div>
    </div>
  )
}
