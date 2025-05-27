import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const foundTask = savedTasks.find(t => String(t.id) === id);
    if (foundTask) {
      setTask({
        ...foundTask,
        status: 'Belum selesai',
        logs: [{ id: 1, status: 'Belum selesai', time: '2025-05-01 10:00' }],
      });
    } else {
      navigate('/tasks'); // Jika tidak ada tugas, kembali ke daftar tugas
    }
  }, [id, navigate]);

  const handleStatusChange = () => {
    if (!newStatus || !task) return;
    const newLog = { id: Date.now(), status: newStatus, time: new Date().toLocaleString() };
    setTask(prev => ({
      ...prev,
      status: newStatus,
      logs: [...prev.logs, newLog],
    }));
    setNewStatus('');
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Kembali</button>
      <h2>{task.title}</h2>

      <p><strong>Status sekarang:</strong> {task.status}</p>

      <div className="mb-3">
        <label>Ubah status tugas:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Masukkan status baru"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleStatusChange}>Update Status</button>
      </div>

      <h4>Log perubahan status</h4>
      <ul className="list-group">
        {task.logs.map(log => (
          <li key={log.id} className="list-group-item">
            {log.status} — <small>{log.time}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}