
import Navbar from '../components/Navbar'
export default function Artworks(){
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-4">
        <h1 className="text-2xl font-semibold">Artworks</h1>
        <div className="card p-6">
          <p className="mb-4 text-nn_muted">Open de Google Drive map voor de artworks.</p>
          <a className="btn-primary" href="https://drive.google.com/drive/u/2/folders/1jZpWCyjCzOlqNfuVA7QrpDu_npU0A8_g" target="_blank" rel="noreferrer">Open Drive map</a>
        </div>
      </div>
    </div>
  )
}
