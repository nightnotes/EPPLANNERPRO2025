import Navbar from '../components/Navbar'
export default function Ads(){
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-4">
        <h1 className="text-2xl font-semibold">Advertentiebeheer</h1>
        <div className="card p-6">
          <p className="mb-4 text-nn_muted">Ga naar Meta Ads manager.</p>
          <a className="btn-primary" href="https://www.facebook.com/adsmanager" target="_blank" rel="noreferrer">Open Ads Manager</a>
        </div>
      </div>
    </div>
  )
}
