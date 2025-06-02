"use client"

export default function About() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-4">Tentang TugasKu 📖</h1>
            <p className="lead text-muted">
              Aplikasi manajemen tugas yang dirancang khusus untuk membantu Anda mengorganisir pekerjaan harian dengan
              lebih efektif.
            </p>
          </div>

          <div className="card shadow-lg border-0 mb-5">
            <div className="card-body p-5">
              <h3 className="text-primary mb-4">🎯 Misi Kami</h3>
              <p className="mb-4">
                TugasKu hadir untuk membantu individu dan tim dalam mengelola tugas-tugas mereka dengan lebih
                terstruktur dan efisien. Kami percaya bahwa dengan organisasi yang baik, setiap orang dapat mencapai
                produktivitas maksimal.
              </p>

              <h3 className="text-primary mb-4">⚡ Mengapa TugasKu?</h3>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-start">
                    <span className="me-3 fs-4">✅</span>
                    <div>
                      <h6 className="fw-bold">Mudah Digunakan</h6>
                      <p className="text-muted small mb-0">Interface yang intuitif dan user-friendly</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-start">
                    <span className="me-3 fs-4">🔒</span>
                    <div>
                      <h6 className="fw-bold">Aman & Terpercaya</h6>
                      <p className="text-muted small mb-0">Data Anda tersimpan dengan aman</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-start">
                    <span className="me-3 fs-4">📱</span>
                    <div>
                      <h6 className="fw-bold">Responsif</h6>
                      <p className="text-muted small mb-0">Dapat diakses dari berbagai perangkat</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-start">
                    <span className="me-3 fs-4">⚡</span>
                    <div>
                      <h6 className="fw-bold">Performa Cepat</h6>
                      <p className="text-muted small mb-0">Loading cepat dan pengalaman yang smooth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow border-0 mb-5">
            <div className="card-body p-5">
              <h3 className="text-primary mb-4">🛠️ Teknologi yang Digunakan</h3>
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Frontend</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">⚛️ React.js</li>
                    <li className="mb-2">🎨 Bootstrap 5</li>
                    <li className="mb-2">📡 Axios</li>
                    <li className="mb-2">🔄 React Router</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Backend</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">🐍 Python Pyramid</li>
                    <li className="mb-2">🗄️ PostgreSQL</li>
                    <li className="mb-2">🔐 JWT Authentication</li>
                    <li className="mb-2">📊 SQLAlchemy ORM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-primary mb-3">👨‍💻 Dikembangkan dengan ❤️</h4>
            <p className="text-muted">
              Proyek ini dikembangkan sebagai tugas besar mata kuliah Pemrograman Web. Terima kasih telah menggunakan
              TugasKu!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
