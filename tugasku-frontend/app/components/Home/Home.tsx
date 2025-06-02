"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Image from "next/image"

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="container-fluid bg-gradient-primary min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="hero-section">
              <h1 className="display-3 fw-bold text-white mb-4">Selamat Datang di TugasKu! 🎯</h1>
              <p className="lead text-white-50 mb-5">
                Aplikasi manajemen tugas yang membantu Anda mengorganisir pekerjaan harian dengan mudah dan efisien.
                Tingkatkan produktivitas Anda hari ini!
              </p>

              <div className="hero-image mb-5 position-relative" style={{ height: "400px" }}>
                <Image
                  src="/image/beranda.jpg"
                  alt="TugasKu Dashboard"
                  fill
                  className="rounded-3 shadow-lg"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>

              {user ? (
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/dashboard" className="btn btn-light btn-lg px-4 py-2">
                    📊 Lihat Dashboard
                  </Link>
                  <Link to="/tasks" className="btn btn-outline-light btn-lg px-4 py-2">
                    📝 Kelola Tugas
                  </Link>
                </div>
              ) : (
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/register" className="btn btn-light btn-lg px-4 py-2">
                    🚀 Mulai Sekarang
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-2">
                    🔑 Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="row mt-5 pt-5">
          <div className="col-12 text-center mb-5">
            <h2 className="text-white mb-4">✨ Fitur Unggulan</h2>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow border-0">
              <div className="card-body text-center p-4">
                <div className="feature-icon mb-3">
                  <span className="display-4">📝</span>
                </div>
                <h5 className="card-title">Manajemen Tugas</h5>
                <p className="card-text text-muted">
                  Buat, edit, dan kelola tugas dengan mudah. Atur prioritas dan status untuk setiap tugas.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow border-0">
              <div className="card-body text-center p-4">
                <div className="feature-icon mb-3">
                  <span className="display-4">📂</span>
                </div>
                <h5 className="card-title">Kategori Tugas</h5>
                <p className="card-text text-muted">
                  Organisir tugas berdasarkan kategori untuk memudahkan pencarian dan pengelompokan.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow border-0">
              <div className="card-body text-center p-4">
                <div className="feature-icon mb-3">
                  <span className="display-4">📊</span>
                </div>
                <h5 className="card-title">Dashboard Analitik</h5>
                <p className="card-text text-muted">
                  Lihat statistik dan progress tugas Anda dalam dashboard yang informatif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
