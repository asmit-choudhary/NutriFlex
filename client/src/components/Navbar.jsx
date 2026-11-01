import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

function Navbar() {
  const { user, logout } = useAuthStore()
  const [plan, setPlan] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'member') {
      api.get('/subscriptions/me')
        .then((res) => setPlan(res.data))
        .catch(() => setPlan(null))
    } else {
      setPlan(null) // clears the badge on logout
    }
  }, [user])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  // built once, used by both the desktop bar and the mobile menu
  const links = []
  if (!user || user.role === 'member') {
    links.push({ to: '/booking', label: 'Consultancy' })
    links.push({ to: '/payment', label: 'Pricing' })
  }
  if (user?.role === 'member') {
    links.push({ to: '/my-bookings', label: 'My bookings' })
  }
  if (user?.role === 'practitioner') {
    links.push({ to: '/dashboard', label: 'Dashboard' })
    links.push({ to: '/profile-setup', label: 'My profile' })
  }

  const planBadge = plan && (
    <span className="text-xs font-semibold bg-accent-2 text-surface px-3 py-1 rounded-full capitalize">
      {plan.plan} plan
    </span>
  )

  return (
    <nav className="max-w-6xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-text">
          NutriFlex
        </Link>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-text">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {planBadge}
              <span className="text-sm text-text-muted">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-brand text-sm font-semibold border border-border text-text hover:bg-surface-2"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="px-6 py-2.5 rounded-brand text-sm font-semibold bg-accent text-surface hover:opacity-90">
                Get started
              </button>
            </Link>
          )}
        </div>

        {/* mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-text"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-surface border border-border rounded-brand p-5 flex flex-col gap-4">
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <span className="text-sm text-text">Hi, {user.name.split(' ')[0]}</span>
              {planBadge}
            </div>
          )}

          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-text-muted"
            >
              {l.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="mt-2 px-5 py-2.5 rounded-brand text-sm font-semibold border border-border text-text"
            >
              Log out
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="w-full mt-2 px-6 py-2.5 rounded-brand text-sm font-semibold bg-accent text-surface">
                Get started
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar