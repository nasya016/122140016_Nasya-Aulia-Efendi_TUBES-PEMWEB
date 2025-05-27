import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // Simpan username & password di localStorage
    localStorage.setItem('user', JSON.stringify({ username, password }));

    setMsg('Registrasi berhasil. Arahkan ke login...');
    setUsername('');
    setPassword('');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      {msg && <div className="alert alert-success">{msg}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-success" type="submit">Register</button>
      </form>
      <p className="mt-3">
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}