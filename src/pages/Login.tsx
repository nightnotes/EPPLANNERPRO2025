
import { useState } from 'react'
import { login, USERS } from '../utils/auth'

export default function Login() {
  const [user, setUser] = useState<typeof USERS[number]>("Nuno")
  const [pwd, setPwd] = useState("")
  const [err, setErr] = useState<string | null>(null)

  // ---- Parallax helpers (avoid inline const in TSX attributes) ----
  function setParallax(el: HTMLDivElement, x: number, y: number) {
    el.style.setProperty('--px', String(x))
    el.style.setProperty('--py', String(y))
  }
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    setParallax(el, e.clientX - (r.left + r.width/2), e.clientY - (r.top + r.height/2))
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setParallax(e.currentTarget, 0, 0)
  }
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0]
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    setParallax(el, t.clientX - (r.left + r.width/2), t.clientY - (r.top + r.height/2))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!login(user, pwd)) {
      setErr("Onjuist wachtwoord.")
      return
    }
    location.reload()
  }

  return (
    <div className="login-hero">
      <div className="section w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: headline + card */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nn_bg2/80 border border-nn_border text-sm text-nn_muted mb-4">
              Night Notes
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-4">Welkom bij<br />Night Notes</h1>
            <p className="text-nn_muted max-w-xl mb-6">Piano melodies that turn the night into your most beautiful dream.</p>

            <div className="card login-card p-6 sm:p-8 max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo-nightnotes.png" alt="Night Notes" className="h-10 w-auto" />
                <div className="font-semibold">Inloggen</div>
              </div>
              <form onSubmit={submit} className="space-y-3">
                <select className="input" value={user} onChange={e => setUser(e.target.value as any)}>
                  {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <input className="input" type="password" placeholder="Wachtwoord" autoComplete="new-password" name="nn-pass" value={pwd} onChange={e => setPwd(e.target.value)} />
                {err && <div className="text-red-400 text-sm">{err}</div>}
                <button className="btn-primary w-full">Log in</button>
              </form>
            </div>
          </div>

          {/* Right: cinematic illustration with parallax */}
          <div className="relative">
            <div
              className="rounded-3xl overflow-hidden shadow-nn ring-1 ring-nn_border/60 illustration-card login-visual"
            ><img src="/logo-nightnotes.png" alt="Night Notes visual" className="w-full h-full object-contain p-10" /></div>
          </div>
        </div>
            
      </div>
    </div>
  )
}
