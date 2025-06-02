"use client"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : ""
  }

  if (!mounted) {
    return null // Don't render anything on the server
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-3">
          🎯 TugasKu
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive("/")}`}>
                🏠 Beranda
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={`nav-link ${isActive("/about")}`}>
                ℹ️ Tentang
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
                    📊 Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/tasks" className={`nav-link ${isActive("/tasks")}`}>
                    📝 Tugas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/categories" className={`nav-link ${isActive("/categories")}`}>
                    📂 Kategori
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    👤 {user.username}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        👤 Profil
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item">
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className={`nav-link ${isActive("/login")}`}>
                    🔑 Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className={`nav-link ${isActive("/register")}`}>
                    📝 Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
