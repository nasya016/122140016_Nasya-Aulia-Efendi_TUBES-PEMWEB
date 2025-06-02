# TugasKu - Aplikasi Manajemen Tugas

Sebuah aplikasi manajemen tugas full-stack modern yang dibangun dengan Python Pyramid (backend) dan Next.js (frontend).

## 🚀 Fitur

- **Autentikasi Pengguna**: Autentikasi berbasis JWT yang aman
- **Manajemen Tugas**: Membuat, membaca, mengubah, dan menghapus tugas dengan pelacakan status
- **Organisasi Kategori**: Mengelompokkan tugas berdasarkan kategori
- **Pencarian & Filter**: Kemampuan pencarian dan filter lanjutan
- **Analitik Dashboard**: Wawasan visual tentang statistik tugas
- **Desain Responsif**: Antarmuka ramah mobile
- **Pembaruan Real-time**: Pembaruan UI instan dengan optimisasi
- **Log Status**: Otomatis mencatat perubahan status tugas

## 🛠️ Teknologi yang Digunakan

### Backend
- **Python 3.11+**
- **Pyramid** - Framework web
- **SQLAlchemy** - ORM
- **PostgreSQL** - Basis data
- **JWT** - Autentikasi
- **bcrypt** - Hashing password
- **pytest** - Pengujian

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Keamanan tipe
- **Bootstrap 5** - Framework UI
- **Axios** - Klien HTTP
- **React Router** - Navigasi
- **React Toastify** - Notifikasi

## 📋 Prasyarat

- Python 3.11+
- Node.js 18+
- PostgreSQL 12+
- Git

## 🔧 Instalasi & Konfigurasi

### 1. Clone Repositori

```bash
git clone <repository-url>
cd tugasku
```

### 2. Setup Backend

```bash
cd tugasku-backend

# Buat lingkungan virtual
python -m venv venv
source venv/bin/activate  # Di Windows gunakan: venv\Scripts\activate

# Instal dependensi
pip install -r requirements.txt

# Instal paket dalam mode pengembangan
pip install -e .

# Konfigurasi variabel lingkungan
cp .env.example .env
# Edit file .env dengan kredensial basis data Anda

# Inisialisasi basis data
python -c "from tugasku_backend.database import init_db; init_db()"

# Jalankan server
pserve development.ini --reload
```

### 3. Setup Frontend

```bash
cd tugasku-frontend

# Instal dependensi
npm install --legacy-peer-deps

# Konfigurasi variabel lingkungan
cp .env.example .env.local
# Edit .env.local dengan URL API Anda

# Jalankan server pengembangan
npm run dev
```

### 4. Setup Basis Data

```sql
-- Buat basis data
CREATE DATABASE tugasku_db;
CREATE USER tugasku_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE tugasku_db TO tugasku_user;
```

## 🐳 Setup Docker

### Menggunakan Docker Compose

```bash
# Clone repositori
git clone <repository-url>
cd tugasku

# Jalankan semua layanan
docker-compose up -d

# Lihat log
docker-compose logs -f

# Hentikan layanan
docker-compose down
```

Aplikasi akan tersedia di:
- Frontend: http://localhost:3000
- Backend API: http://localhost:6543

## 🧪 Pengujian

### Pengujian Backend

```bash
cd tugasku-backend

# Jalankan semua tes
pytest

# Jalankan tes dengan laporan cakupan
pytest --cov=tugasku_backend --cov-report=html

# Jalankan tes pada file tertentu
pytest tests/test_auth.py
```

### Pengujian Frontend

```bash
cd tugasku-frontend

# Jalankan tes
npm test

# Jalankan tes dengan laporan cakupan
npm test -- --coverage
```

## 📚 Dokumentasi API

### Endpoint Autentikasi

- `POST /api/auth/register` - Registrasi pengguna
- `POST /api/auth/login` - Login pengguna
- `GET /api/auth/profile` - Mendapatkan profil pengguna

### Endpoint Tugas

- `GET /api/tasks` - Mendapatkan daftar tugas (dengan filter)
- `POST /api/tasks` - Membuat tugas baru
- `GET /api/tasks/{id}` - Mendapatkan detail tugas
- `PUT /api/tasks/{id}` - Memperbarui tugas
- `DELETE /api/tasks/{id}` - Menghapus tugas

### Endpoint Kategori

- `GET /api/categories` - Mendapatkan semua kategori
- `POST /api/categories` - Membuat kategori baru
- `PUT /api/categories/{id}` - Memperbarui kategori
- `DELETE /api/categories/{id}` - Menghapus kategori

### Endpoint Dashboard

- `GET /api/dashboard` - Mendapatkan statistik dashboard

## 🔒 Fitur Keamanan

- Autentikasi berbasis token JWT
- Hashing password menggunakan bcrypt
- Perlindungan CORS
- Validasi dan sanitasi input
- Pencegahan SQL injection menggunakan ORM SQLAlchemy
- Perlindungan XSS

## 📱 Fitur Frontend

- Desain responsif untuk semua ukuran layar
- Validasi form real-time
- State loading dan penanganan error
- Notifikasi toast
- Pembaruan UI optimis
- Error boundaries
- TypeScript untuk keamanan tipe

## 🏗️ Struktur Proyek

```
tugasku/
├── tugasku-backend/
│   ├── tugasku_backend/
│   │   ├── models/          # Model basis data
│   │   ├── views/           # Endpoint API
│   │   ├── middleware/      # Middleware kustom
│   │   ├── utils/           # Fungsi utilitas
│   │   ├── database/        # Konfigurasi basis data
│   │   └── config.py        # Konfigurasi
│   ├── tests/               # Tes backend
│   ├── requirements.txt     # Dependensi Python
│   └── setup.py            # Konfigurasi paket
├── tugasku-frontend/
│   ├── app/
│   │   ├── components/      # Komponen React
│   │   ├── hooks/           # Hooks kustom
│   │   ├── lib/             # Utilitas dan API
│   │   ├── types/           # Tipe TypeScript
│   │   └── context/         # Context React
│   ├── public/              # Aset statis
│   └── package.json         # Dependensi Node
└── docker-compose.yml       # Konfigurasi Docker
```

## 🚀 Deployment

### Deployment Backend

1. Atur variabel lingkungan untuk produksi
2. Gunakan server WSGI produksi (sudah dikonfigurasi dengan Waitress)
3. Siapkan basis data PostgreSQL
4. Konfigurasikan reverse proxy (nginx)

### Deployment Frontend

1. Bangun aplikasi: `npm run build`
2. Deploy ke Vercel, Netlify, atau layanan hosting statis lainnya
3. Atur variabel lingkungan untuk URL API produksi

## 🤝 Kontribusi

1. Fork repositori
2. Buat cabang fitur: `git checkout -b feature-name`
3. Lakukan perubahan dan tambahkan tes
4. Commit perubahan: `git commit -am 'Add feature'`
5. Push ke cabang: `git push origin feature-name`
6. Kirim pull request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file LICENSE untuk detailnya.

## 👥 Penulis

- **Your Name** - Pekerjaan awal

## 🙏 Ucapan Terima Kasih

- Dibuat untuk proyek akhir mata kuliah Pemrograman Web
- Terima kasih kepada komunitas open-source atas alat dan library yang luar biasa

## 📇 Kredit

**Nama** : Nasya Aulia Efendi  
**NIM** : 122140016  
**Kelas** : Pemrograman Web RA  
**Program Studi** : Teknik Informatika  
**Institusi** : Institut Teknologi Sumatera