// Lokasi: resources/js/components/wl/navbar.tsx

import { type SharedData, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import LVMSLogo from "./logo-lvms";

// Helper untuk menentukan rute dan teks tombol berdasarkan peran
const getDashboardInfo = (user: User) => {
    switch (user.role) {
        case 'admin':
            return { href: '/dashboard/home', text: 'Dashboard Admin' };
        case 'pengawas':
            return { href: '/pengawas', text: 'Dashboard Pengawas' };
        case 'ruang':
            return { href: '/ruang/welcome', text: 'Masuk Ruang' };
        default:
            return { href: '/login', text: 'Dashboard' };
    }
};

const Navbar: React.FC = () => {
  const { auth } = usePage<SharedData>().props;
  const user = auth.user; // Ambil data user dari Inertia

  // Mendapatkan info dashboard jika user ada
  const dashboardInfo = user ? getDashboardInfo(user) : null;

  return (
    <header className="py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-4 p-4">
          <LVMSLogo className="size-16 fill-current text-white dark:text-black" />
          <h1 className="text-2xl font-bold text-white">LVMS</h1>
        </div>
        
        <nav className="flex items-center justify-end gap-4">
          {user ? (
            // Jika SUDAH LOGIN (untuk semua role), tampilkan tombol ke halamannya masing-masing
            <Link
              href={dashboardInfo!.href}
              className="inline-block rounded-sm border border-[#19140035] bg-yellow-400 px-5 py-1.5 text-sm font-semibold leading-normal text-[#1b1b18] hover:border-[#1915014a]"
            >
              {dashboardInfo!.text}
            </Link>
          ) : (
            // Jika BELUM LOGIN, selalu tampilkan tombol Log in
            <Link
              href="/login"
              className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-white hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;