import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();

  // Deklarasi hooks tanpa kondisi
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  // Tampilkan loading jika user belum ada
  if (!user) {
    return (
      <div className="container mt-4">
        <p>Loading user data...</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (!username.trim() || !email.trim()) {
      setMessage('Username dan Email tidak boleh kosong.');
      return;
    }

    updateUser({ username: username.trim(), email: email.trim() });
    setMessage('Profil berhasil diperbarui!');
  };

  return (
    <div className="container mt-4">
      <h2>Manajemen Akun</h2>

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
      </form>
    </div>
  );
}