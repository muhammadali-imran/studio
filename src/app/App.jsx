import { BrowserRouter } from 'react-router-dom'
import AppProviders from './providers'
import AppRouter from './router'

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,146,255,0.16),_transparent_28%),linear-gradient(135deg,_#f8fbff_0%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 flex items-center justify-between rounded-3xl border border-sky-100/70 bg-white/75 px-4 py-3 shadow-[0_10px_40px_rgba(26,43,73,0.06)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-600">Learning platform</p>
            <h1 className="text-lg font-semibold text-navy">Studio workspace</h1>
          </div>
          <div className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">Live authoring</div>
        </header>

        <div className="blob-sky" style={{ width: 420, height: 420, top: 40, left: -120 }} />
        <div className="blob-gold" style={{ width: 320, height: 320, right: -80, top: 160 }} />

        <div className="flex-1 rounded-4xl border border-slate-200/70 bg-white/80 p-2 shadow-[0_24px_80px_rgba(26,43,73,0.08)] backdrop-blur">
          <div className="min-h-full rounded-3xl bg-slate-50/80 p-2">
            <BrowserRouter>
              <AppProviders>
                <AppRouter />
              </AppProviders>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </div>
  )
}
