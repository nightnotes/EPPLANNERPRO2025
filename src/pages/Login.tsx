import { useState } from 'react'
import { login, USERS, User } from '../utils/auth'

export default function Login() {
  const [user, setUser] = useState<User>('Nuno')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const ok = login(user, password)
    if (!ok) {
      setError('Onjuist wachtwoord. Tip: het is "123!"')
    } else {
      location.href = '/'
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-nn_bg1">
      <form onSubmit={onSubmit} className="card p-6 w-full max-w-md space-y-4">
        <img src="/logo-nightnotes.png" className="h-20 mx-auto" alt="Night Notes" />
        <div>
          <label className="block text-sm mb-1">Gebruiker</label>
          <select className="input w-full" value={user} onChange={e => setUser(e.target.value as User)}>
            {USERS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Wachtwoord</label>
          <input className="input w-full" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='123!' />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button className="btn-primary w-full">Log in</button>
      </form>
    </div>
  )
}
