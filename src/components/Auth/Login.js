import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && username === storedUser.username && password === storedUser.password) {
      login(storedUser);
      navigate('/tasks');
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        {/* form input username & password */}
      </form>
      <p className="mt-3">
        Belum punya akun? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}