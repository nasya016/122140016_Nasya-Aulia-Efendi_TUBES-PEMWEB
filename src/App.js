import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Dashboard/TaskList';
import TaskDetail from './components/Dashboard/TaskDetail';
import CategoryList from './components/Dashboard/CategoryList';
import Profile from './components/Account/Profile';
import PrivateRoute from './components/Auth/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">TugasKu</Link>

      <div className="navbar-nav me-auto">
        <Link className="nav-link" to="/">Beranda</Link>
        <Link className="nav-link" to="/about">Tentang</Link>
        {user && <Link className="nav-link" to="/tasks">Tugas</Link>}
        {user && <Link className="nav-link" to="/categories">Kategori</Link>}
        {user && <Link className="nav-link" to="/profile">Akun</Link>}
        {!user && <Link className="nav-link" to="/login">Login</Link>}
        {!user && <Link className="nav-link" to="/register">Register</Link>}
      </div>

      {user && (
        <div className="d-flex align-items-center">
          <span className="navbar-text me-2">Halo, {user.username}</span>
          <button onClick={logout} className="btn btn-outline-light btn-sm">Logout</button>
        </div>
      )}
    </nav>
  );
}

function Home() {
  return (
    <div className="container mt-4 text-center">
      <h1 className="text-primary mb-4">Halo, Selamat Datang di TugasKu!</h1>
      <img
      src="/image/beranda.jpg"  // <-- hapus "public" di path ini
      alt="Beranda"
      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
      />

      <p>Silahkan Login untuk menikmati fitur-fitur yang ada di TugasKu</p>
    </div>
  );
}

function About() {
  return (
    <div className="container mt-4">
      <h2>Tentang Aplikasi</h2>
      <p>Aplikasi ini membantu kamu mengelola tugas harian dengan mudah.</p>
      <p>Selamat Mencobaaa!!!! 🤩✨</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <PrivateRoute>
                <TaskDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <CategoryList />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}