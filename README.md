# EP Planner PRO (React + Vite + Tailwind) — Netlify-ready

- Home: volledige planning (25-08-2025 t/m 31-12-2026), status-dot wordt groen wanneer afgevinkt in EP Checklist.
- EP Checklist: per ingelogde user (Nuno/Martijn), 45 dagen window, Splits & Buma/Stemra → Klaar, met snelle links en progress bar.
- Artworks: opent Google Drive map.
- Advertentiebeheer: opent Meta Ads Manager.

Netlify: Build `npm run build`, Publish `dist`. HTTPS & SPA routing geregeld via `public/_headers` en `public/_redirects`.

## 2025-08-15 — Updates by ChatGPT

### Streams
- Added artists to `public/artists.json` so they appear in the Streams tab and count in the totals:
  - Dreamflow (`3JxvfjZaLHM60yYRt7BYZm`)
  - Poluz (`0vaXEuhH3eaJuTdMoLFdbN`)
  - Doris Lost (`43U1R9AZoGI3V5iaW6lht8`)
  - Eternal (`4oOqA7kbwce90hbDDKjoID`)
  - Slaapmutsje (`1iH0DmClTXD3DEXO490gbq`)
  - ZizZa (`20ajFDuyJzM8xGkWL9agiV`)
  - Sleepy Teas (`3Ax9FlTyHNJdOhAKaxhZl9`)

_No code changes needed in the Streams app—it's data‑driven. Updating `artists.json` is sufficient._

### Releases (cross‑user sync)
- Fixed a bugged `useEffect` cleanup in `src/components/ReleasesTable.tsx` that referenced an undefined `stop()`.
- Implemented polling against the Netlify `kv-store` function every 5s. This keeps **Status** (green/red) in sync for **all users/devices** automatically without manual reloads.
- LocalStorage is still used for instant UI feedback, but is now merged with cloud state on every poll, so everyone sees the same result.

**Netlify prerequisites**  
The `/.netlify/functions/kv-store` endpoint uses **Netlify Blobs** (built-in). No extra setup is needed on Netlify—just deploy. If using a different host, you can replace the function with any JSON key‑value store.

### Deploy
- Build: `npm run build`
- Publish directory: `dist`
