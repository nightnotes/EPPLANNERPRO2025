
import { useState } from 'react'
import { login, USERS } from '../utils/auth'

export default function Login() {
  const [user, setUser] = useState<typeof USERS[number]>("Nuno")
  const [pwd, setPwd] = useState("")
  const [err, setErr] = useState<string | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!login(user, pwd)) {
      setErr("Onjuist wachtwoord.")
      return
    }
    location.reload()
  }

  return (
    <div className="min-h-screen flex items-center">
      <div className="section w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: headline + card */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nn_bg2/80 border border-nn_border text-sm text-nn_muted mb-4">
              Night Notes
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-4">Welkom bij<br />Night Notes</h1>
            <p className="text-nn_muted max-w-xl mb-6">Log in om releases te beheren, je EP-checklist af te vinken en snel door te klikken naar DistroKid, Amuse en Buma/Stemra.</p>

            <div className="card p-6 sm:p-8 max-w-md">
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

          {/* Right: image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-nn ring-1 ring-nn_border/60 bg-nn_bg2/60">
              <img src="/logo-nightnotes.png" alt="Night Notes visual" className="w-full h-[420px] object-contain bg-gradient-to-b from-nn_bg1/60 to-nn_bg2/60 p-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
