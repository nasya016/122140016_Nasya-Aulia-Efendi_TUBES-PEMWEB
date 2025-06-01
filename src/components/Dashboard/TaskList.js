import React, { useState, useEffect } from 'react';
import { fetchTasks, fetchCategories, addTask, deleteTask } from '../../api/api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // ubah ke null
  const [searchTask, setSearchTask] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const tasksFromAPI = await fetchTasks();
        setTasks(tasksFromAPI);
        const categoriesFromAPI = await fetchCategories();
        setCategories(categoriesFromAPI);
      } catch (error) {
        console.error('Error load data:', error);
      }
    }
    loadData();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    try {
      const newTaskData = {
        title: newTask.trim(),
        category_id: selectedCategory,  // sudah angka atau null
      };
      const addedTask = await addTask(newTaskData);
      setTasks([...tasks, addedTask]);
      setNewTask('');
      setSelectedCategory(null);  // reset ke null
    } catch (error) {
      alert('Gagal menambah tugas');
      console.error(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      alert('Gagal menghapus tugas');
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTask.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Daftar Tugas</h2>

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
          value={selectedCategory ?? ''}  // gunakan empty string jika null agar tidak warning
          onChange={e => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}  // ubah string ke number atau null
        >
          <option value="">Pilih Kategori (opsional)</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                  backgroundColor: '#f8f9fa'
                }}
              >
                {task.title}
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
                  color: '#555'
                }}
              >
                {task.category?.name || '-'}
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