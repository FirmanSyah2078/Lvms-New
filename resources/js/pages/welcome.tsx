// src/App.tsx

import React from 'react';
import VantaBackground from '@/components/wl/VantaBackground';
import Navbar from '@/components/wl/navbar';
import Hero from '@/components/wl/hero';

const App: React.FC = () => {
  return (
    <VantaBackground>
      {/* Semua komponen halaman Anda sekarang menjadi children dari VantaBackground */}
      <Navbar />
      <main>
        <Hero />
        {/* Di sini nanti kita akan tambahkan komponen selanjutnya (Features, dll) */}
      </main>
    </VantaBackground>
  );
};

export default App;