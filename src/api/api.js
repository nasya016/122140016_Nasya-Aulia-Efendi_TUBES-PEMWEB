const API_BASE_URL = 'http://localhost:6543'; // Sesuaikan dengan URL backend

export async function fetchTasks() {
  const res = await fetch(`${API_BASE_URL}/tasks`);
  if (!res.ok) throw new Error('Gagal fetch tasks');
  return await res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Gagal fetch categories');
  return await res.json();
}

export async function addTask(task) {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: task.title,
      category_id: task.category_id || null, // harus kirim ID kategori, bukan nama
    }),
  });
  if (!res.ok) throw new Error('Gagal tambah task');
  return await res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Gagal hapus task');
  return true;
}

export async function addCategory(name) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Gagal tambah kategori');
  return await res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Gagal hapus kategori');
  return true;
}