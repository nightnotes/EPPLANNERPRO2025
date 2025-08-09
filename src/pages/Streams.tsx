
import Navbar from '../components/Navbar'

export default function Streams() {
  return (
    <div className="min-h-screen bg-nn_bg1 text-nn_text">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">STREAMS</h1>
        <div className="rounded-2xl overflow-hidden border border-nn_border bg-nn_bg2 shadow">
          <iframe
            src="/streams.html"
            width="100%"
            height="1200"
            style={{ border: '0' }}
            title="Night Notes Streams"
          />
        </div>
        <p className="text-nn_muted text-sm mt-2">
          Tip: je kunt dit ook openen als losse pagina via <code>/streams.html</code>. Data blijft lokaal in je browser.
        </p>
      </div>
    </div>
  )
}
