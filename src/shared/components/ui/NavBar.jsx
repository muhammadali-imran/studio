import Logo from './logo';
import { Link, NavLink } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export default function NavBar({ logo, links = [], actionButton }) {
  const navRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          if (self.direction === -1 && self.progress < 0.05) {
            gsap.to(navRef.current, {
              background: 'rgba(255,255,255,0.80)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              duration: 0.35,
            });
          } else if (self.direction === 1 && self.progress > 0.02) {
            gsap.to(navRef.current, {
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 4px 24px rgba(22,163,74,0.10)',
              duration: 0.35,
            });
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const navLinks = links.length > 0 ? links : [
    { to: '/', label: 'Home' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 lg:px-16 py-3.5 bg-white/80 backdrop-blur-lg border-b border-emerald-100/60"
        style={{ willChange: 'background, box-shadow' }}
      >
        {logo || <Logo />}

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-cantarell">
          {navLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) =>
                `nav-item text-sm font-semibold transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          {actionButton || (
            <Link
              to="/login"
              className="nav-item inline-flex items-center px-5 py-2.5 text-sm font-bold rounded-xl text-white shadow-lg font-cantarell transition-all"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                boxShadow: '0 4px 18px rgba(22,163,74,0.35)',
              }}
            >
              Launch Studio
            </Link>
          )}
          <button
            className="md:hidden nav-item p-2 rounded-lg hover:bg-emerald-50 transition-colors"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round">
              {mobileOpen
                ? <path d="M6 18L18 6M6 6l12 12" />
                : <path d="M3 6h18M3 12h18M3 18h18" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-16">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white/95 backdrop-blur-md shadow-xl px-6 py-6 flex flex-col gap-4 border-b border-emerald-100">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-emerald-600 transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}