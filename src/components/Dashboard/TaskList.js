import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TaskList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Tambahan state pencarian tugas
  const [searchTask, setSearchTask] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const task = {
      id: Date.now(),
      title: newTask.trim(),
      category: selectedCategory || '',
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setNewTask('');
    setSelectedCategory('');
  };

  const handleDeleteTask = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
  };

  // Filter tugas berdasarkan pencarian
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTask.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Daftar Tugas</h2>

      {/* Input pencarian tugas */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari tugas..."
        value={searchTask}
        onChange={e => setSearchTask(e.target.value)}
      />

      <form onSubmit={handleAddTask} className="mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Tambah tugas baru..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <select
          className="form-select"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">Pilih Kategori (opsional)</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit">Tambah</button>
      </form>

      {filteredTasks.length === 0 ? (
        <p>Tidak ada tugas.</p>
      ) : (
        <ul className="list-group">
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ gap: '10px' }}
            >
              <div
                style={{
                  flex: '1 1 60%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                  {task.title}
                </Link>
              </div>

              <div
                style={{
                  flex: '1 1 30%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: '#e9ecef',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                {task.category || '-'}
              </div>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteTask(task.id)}
                style={{ flex: '0 0 auto' }}
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}