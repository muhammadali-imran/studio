import { Outlet } from 'react-router-dom'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useSidebar from '@shared/hooks/useSidebar'
import useAuth from '@shared/hooks/useAuth'
import Avatar from '@shared/components/ui/Avatar'

const navItems = [
  { to: '/dashboard',      label: 'Dashboard',      icon: '🏠' },
  { to: '/courses',        label: 'Courses',         icon: '📚' },
  { to: '/students',       label: 'Students',        icon: '👥' },
  { to: '/library',        label: 'Library',         icon: '🗂️' },
  { to: '/announcements',  label: 'Announcements',   icon: '📢' },
  { to: '/reports',        label: 'Reports',         icon: '📊' },
]

const adminItems = [
  { to: '/users',   label: 'Users',    icon: '🛡️' },
  { to: '/fees',    label: 'Fees',     icon: '💳' },
]

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

function Sidebar() {
  const { open } = useSidebar()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <aside id="studio-sidebar" className={`fixed top-0 left-0 h-full z-30 flex flex-col bg-[#1e1040] text-white transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-0 lg:w-16 overflow-hidden'}`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 min-h-16 ${!open && 'lg:justify-center lg:px-0'}`}>
          <span className="text-2xl">🎓</span>
          {open && (
            <div>
              <span className="font-bold text-lg tracking-tight">Studio</span>
              <p className="text-[10px] text-white/40 uppercase tracking-widest -mt-0.5">Educator Dashboard</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navItems.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}
                ${!open && 'lg:justify-center lg:px-0 lg:mx-1'}`
              }>
              <span className="text-lg leading-none">{icon}</span>
              {open && <span>{label}</span>}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              {open && <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">Admin</p>}
              {!open && <div className="my-2 mx-3 border-t border-white/10" />}
              {adminItems.map(({ to, label, icon }) => (
                <NavLink key={to} to={to} title={label}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-xl text-sm font-medium transition-colors
                    ${isActive ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}
                    ${!open && 'lg:justify-center lg:px-0 lg:mx-1'}`
                  }>
                  <span className="text-lg leading-none">{icon}</span>
                  {open && <span>{label}</span>}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="py-3 border-t border-white/10">
          {bottomItems.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}
                ${!open && 'lg:justify-center lg:px-0 lg:mx-1'}`
              }>
              <span className="text-lg leading-none">{icon}</span>
              {open && <span>{label}</span>}
            </NavLink>
          ))}

          {open && user && (
            <div className="flex items-center gap-3 px-4 py-3 mx-2 mt-2 rounded-xl bg-white/10">
              <Avatar name={user.name || user.email} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name || 'Instructor'}</p>
                <p className="text-xs text-white/50 truncate capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function TopBar() {
  const { toggle, open } = useSidebar()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={open}
          aria-controls="studio-sidebar"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-violet-700">Studio</span>
          <span className="hidden sm:inline text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
            <Avatar name={user?.name || user?.email} size="sm" />
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-800 truncate">{user?.name || 'Instructor'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <button onClick={() => { navigate('/settings'); setMenuOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Settings</button>
                <div className="border-t border-slate-100" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign out</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default function StudioLayout() {
  const { open } = useSidebar()
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${open ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <TopBar />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
        <footer className="bg-white border-t border-slate-100 px-6 py-3 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Studio — Educator Dashboard
        </footer>
      </div>
    </div>
  )
}
