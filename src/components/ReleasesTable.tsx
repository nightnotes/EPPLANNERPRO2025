import { useEffect, useState, useRef } from 'react'
import { ReleaseRow } from '../utils/schedule'
import { makeKey, getDone, setDone } from '../utils/releaseState'

type Props = { rows: ReleaseRow[] }

function Dot({ k }: { k: string }) {
  const [done, setLocalDone] = useState<boolean>(getDone(k));
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onSync = (e: StorageEvent) => { if (e.key === 'releaseStates') setLocalDone(getDone(k)); };
    window.addEventListener('storage', onSync);
    return () => window.removeEventListener('storage', onSync);
  }, [k]);

  const onClick = () => { setDone(k, true); setLocalDone(true); };

  const onPointerDown = () => {
    timer.current = window.setTimeout(() => {
      setDone(k, false);
      setLocalDone(false);
      timer.current = null;
    }, 2000);
  };
  const clearTimer = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };

  return (
    <button
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      className={`h-4 w-4 rounded-full border transition-all ${done ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'}`}
      title={done ? 'Klaar — 2 sec ingedrukt houden om terug te zetten' : 'Niet klaar — klik om groen te maken'}
    />
  );
}

export default function ReleasesTable({ rows }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Artiest</th>
            <th>Wie</th>
            <th>Distributie</th>
            <th>Klaar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const k = makeKey(r.date, r.artist);
            return (
              <tr key={k}>
                <td>{r.date}</td>
                <td>{r.artist}</td>
                <td>{r.who}</td>
                <td>{r.distribution}</td>
                <td><Dot k={k} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
