// src/components/Hero.tsx

import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-white text-center py-20">
      <div className="container mx-auto px-6">
        {/* Judul Utama */}
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          Selamat Datang di <span className="text-violet-400">LVMS</span>
        </h2>

        {/* Deskripsi Singkat */}
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Platform manajemen pemungutan suara yang modern, aman, dan transparan.
          Mudahkan proses pemilihan dengan teknologi terdepan.
        </p>

        {/* Tombol Aksi Utama */}
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 mb-16">
          Mulai Gunakan
        </button>

        {/* Placeholder untuk Mockup/Gambar Aplikasi */}
        <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl shadow-violet-500/10 p-4">
          {/* Anda bisa ganti div ini dengan gambar screenshot aplikasi LVMS Anda */}
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">[Tampilan Aplikasi LVMS Anda di sini]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;