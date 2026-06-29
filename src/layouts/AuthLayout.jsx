import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1040] via-[#2d1b6b] to-[#1e1040] flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-3 mb-8 text-white">
        <span className="text-3xl">🎓</span>
        <div>
          <span className="text-2xl font-bold tracking-tight block">Studio</span>
          <p className="text-[10px] text-white/40 uppercase tracking-widest -mt-1">Educator Dashboard</p>
        </div>
      </Link>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {children}
      </div>
      <p className="mt-6 text-white/40 text-xs">
        © {new Date().getFullYear()} Studio · For instructors &amp; administrators only
      </p>
    </div>
  )
}
