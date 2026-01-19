// File: index.d.ts
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

declare global {
    const route: (
        name?: string,
        params?: Record<string, unknown> | unknown,
        absolute?: boolean
    ) => string;
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | string | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: {
        user: User | null; 
    };
    app: {
        version: string;
    };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Peserta {
  id: number;
  nama_lengkap: string;
  nis_nip: string;
  kategori: string;
  no_antrian: number | null;
  status: 'Voted' | 'Not Voted';
  sudah_absen: boolean;
  sudah_hadir: boolean;
}

export interface User {
    id: number;
    name: string;
    role: 'admin' | 'pengawas' | 'ruang';
    avatar?: string | null; 
    avatar_url?: string | null; // ubah jadi optional
    created_at: string;
    updated_at: string;
}