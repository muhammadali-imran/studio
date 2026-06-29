import { Link, useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl mb-6">🔍</span>
      <h1 className="text-6xl font-extrabold text-indigo-950 mb-3">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 mb-3">Page not found</h2>
      <p className="text-slate-500 max-w-sm mb-8">The page you're looking for doesn't exist or you don't have permission to view it.</p>
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
          Go back
        </button>
        <Link to="/dashboard" className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors">
          Dashboard
        </Link>
      </div>
    </div>
  )
}
