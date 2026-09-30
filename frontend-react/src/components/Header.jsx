import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import { RiStockLine } from 'react-icons/ri'
import { MdDashboard, MdLogin, MdLogout, MdPersonAdd } from 'react-icons/md'

const Header = () => {
  const { isLoggedIN, setIsLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? 'bg-base-100/90 backdrop-blur-lg shadow-md border-b border-base-content/10'
          : 'bg-base-100 border-b border-base-content/10'
        }`}
    >
      <div className="navbar max-w-6xl mx-auto px-4 py-2">

        {/* Brand */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
              <RiStockLine />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Stock<span className="text-cyan-400">Forecast</span>
            </span>
          </Link>
        </div>

        {/* Nav actions */}
        <div className="navbar-end flex items-center gap-2">
          {isLoggedIN ? (
            <>
              <Link
                to="/dashboard"
                className="btn btn-ghost btn-sm gap-2 text-base-content/80 hover:text-base-content"
              >
                <MdDashboard className="text-base" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline btn-error gap-2"
              >
                <MdLogout className="text-base" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost btn-sm gap-2 text-base-content/80 hover:text-base-content"
              >
                <MdLogin className="text-base" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                to="/register"
                className="btn btn-sm gap-2 text-white border-none hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
              >
                <MdPersonAdd className="text-base" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}

export default Header
