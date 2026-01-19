// src/components/wl/VantaBackground.tsx

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import FOG from 'vanta/dist/vanta.fog.min.js';
import * as THREE from 'three';

interface VantaEffect {
  destroy: () => void;
}

type VantaBackgroundProps = {
  children: ReactNode;
};

const VantaBackground: React.FC<VantaBackgroundProps> = ({ children }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effect = FOG({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0x210c31,
        midtoneColor: 0x4d2a93,
        lowlightColor: 0x0c011f,
        baseColor: 0x0c011f,
        blurFactor: 0.59,
        speed: 1.20,
        zoom: 0.60
      });
      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    // Menggunakan React Fragment karena kita punya dua elemen utama
    <>
      {/* LAPISAN 1: Background Vanta yang 'fixed' di belakang */}
      <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full z-0" />

      {/* LAPISAN 2: Konten Anda yang bisa di-scroll di atasnya */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
};

export default VantaBackground;