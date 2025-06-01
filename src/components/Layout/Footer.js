import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white text-center py-3 mt-5">
      <div className="container">
        <small>
          &copy; {new Date().getFullYear()} TugasKu. Dibuat oleh Mahasiswa Psikologi.
        </small>
      </div>
    </footer>
  );
}