import React, { useState, useEffect } from 'react';

export default function CategoryList() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : [];
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // Tambahan state pencarian kategori
  const [searchCategory, setSearchCategory] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (trimmed === '') return;

    if (categories.includes(trimmed)) {
      alert('Kategori sudah ada!');
      return;
    }

    const updatedCategories = [...categories, trimmed];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setNewCategory('');
  };

  const handleDeleteCategory = (category) => {
    const filteredCategories = categories.filter(cat => cat !== category);
    setCategories(filteredCategories);
    localStorage.setItem('categories', JSON.stringify(filteredCategories));

    const updatedTasks = tasks.map(task =>
      task.category === category ? { ...task, category: null } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setEditingValue(category);
  };

  const handleSaveEdit = () => {
    const trimmed = editingValue.trim();
    if (trimmed === '') {
      alert('Kategori tidak boleh kosong!');
      return;
    }
    if (categories.includes(trimmed) && trimmed !== editingCategory) {
      alert('Kategori sudah ada!');
      return;
    }

    const updatedCategories = categories.map(cat =>
      cat === editingCategory ? trimmed : cat
    );
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));

    const updatedTasks = tasks.map(task =>
      task.category === editingCategory ? { ...task, category: trimmed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setEditingCategory(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingValue('');
  };

  // Filter kategori berdasarkan pencarian
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchCategory.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Manajemen Kategori</h2>

      {/* Input pencarian kategori */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari kategori..."
        value={searchCategory}
        onChange={e => setSearchCategory(e.target.value)}
      />

      <form onSubmit={handleAddCategory} className="mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Tambah kategori baru..."
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Tambah</button>
      </form>

      {filteredCategories.length === 0 ? (
        <p>Tidak ada kategori.</p>
      ) : (
        filteredCategories.map(cat => {
          const tasksInCategory = tasks.filter(task => task.category === cat);
          return (
            <div key={cat} className="mb-4 p-3 border rounded shadow-sm bg-white">
              <div className="d-flex justify-content-between align-items-center mb-2">
                {editingCategory === cat ? (
                  <>
                    <input
                      type="text"
                      className="form-control me-2"
                      value={editingValue}
                      onChange={e => setEditingValue(e.target.value)}
                    />
                    <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdit}>Simpan</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Batal</button>
                  </>
                ) : (
                  <>
                    <h4 className="mb-0">{cat}</h4>
                    <div>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleStartEdit(cat)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(cat)}>Hapus</button>
                    </div>
                  </>
                )}
              </div>

              {tasksInCategory.length === 0 ? (
                <p className="text-muted">Tidak ada tugas dalam kategori ini.</p>
              ) : (
                <ul className="list-group">
                  {tasksInCategory.map(task => (
                    <li key={task.id} className="list-group-item">
                      {task.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}