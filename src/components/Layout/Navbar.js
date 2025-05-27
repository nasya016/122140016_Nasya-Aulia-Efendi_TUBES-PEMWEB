import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        {/* Logo Brand */}
        <Link to="/" className="navbar-brand fw-bold">TugasKu</Link>

        {/* Navbar menu */}
        <div className="collapse navbar-collapse justify-content-between">
          <ul className="navbar-nav d-flex flex-row gap-3">
            <li className="nav-item">
              <Link to="/" className="nav-link">Beranda</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">Tentang</Link>
            </li>
            <li className="nav-item">
              <Link to="/tasks" className="nav-link">Tugas</Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className="nav-link">Kategori</Link>
            </li>
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="text-white me-3">Halo, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Logout</button>
              </>
            ) : (
              <ul className="navbar-nav d-flex flex-row gap-3">
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}