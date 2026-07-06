import { Link } from 'react-router-dom'
import NavBar from '../components/ui/NavBar'
import Logo from '../components/ui/logo'

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #065f46 100%)' }}
    >
      <NavBar
        logo={<Logo />}
        links={[
          { to: '/', label: 'Home' },
          { to: '/login', label: 'Login' },
          { to: '/register', label: 'Register' },
        ]}
        actionButton={
          <Link
            to="/login"
            className="nav-item inline-flex items-center px-5 py-2.5 text-sm font-bold rounded-xl text-white shadow-lg font-cantarell"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', boxShadow: '0 4px 18px rgba(22,163,74,0.40)' }}
          >
            Launch Studio
          </Link>
        }
      />

      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-24">
        {/* Studio branding */}
        <Link to="/" className="flex items-center gap-3 mb-8 text-white">
          <span className="text-3xl">🎓</span>
          <div>
            <span className="text-2xl font-bold tracking-tight block">Studio</span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest -mt-1">Educator Dashboard</p>
          </div>
        </Link>

        {/* Auth card */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-emerald-100/30">
          {children}
        </div>

        <p className="mt-6 text-white/40 text-xs">
          © {new Date().getFullYear()} Studio · For instructors &amp; administrators only
        </p>
      </div>
    </div>
  )
}
