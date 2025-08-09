import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 nav-shell">
      <div className="section flex items-center justify-between py-3">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="EP Planner Pro" className="h-10 sm:h-12 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm subtle">Night Notes</div>
            <div className="font-semibold tracking-wide">EP Planner Pro</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="hidden sm:flex items-center gap-2">
          <NavLink to="/" end className={({isActive}) => `tab ${isActive ? 'tab-active tab-underline' : ''}`}>RELEASES</NavLink>
          <NavLink to="/checklist" className={({isActive}) => `tab ${isActive ? 'tab-active tab-underline' : ''}`}>EP CHECKLIST</NavLink>
          <NavLink to="/artworks" className={({isActive}) => `tab ${isActive ? 'tab-active tab-underline' : ''}`}>ARTWORKS</NavLink>
          <NavLink to="/ads" className={({isActive}) => `tab ${isActive ? 'tab-active tab-underline' : ''}`}>ADVERTENTIEBEHEER</NavLink>
          <NavLink to="/streams" className={({isActive}) => `tab ${isActive ? 'tab-active tab-underline' : ''}`}>STREAMS</NavLink>
        </div>

        {/* Actions (rechts) */}
        <div className="flex items-center gap-2">
          <a href="/streams.html" className="btn-ghost btn hidden md:inline-flex">Losse streams</a>
          <a href="#" className="btn-primary btn">Opslaan</a>
        </div>
      </div>
    </nav>
  )
}
