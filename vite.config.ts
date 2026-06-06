import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';

// Memaksa Node.js untuk mendahulukan IPv4 agar koneksi lebih stabil di Windows
import dns from 'node:dns';
dns.setDefaultResultOrder('verbatim');

export default defineConfig(({ mode }) => {
    // 1. Memuat variabel dari .env
    const env = loadEnv(mode, process.cwd(), '');

    // 2. Deteksi folder proyek otomatis (misal: lvms-v3)
    const folderName = path.basename(process.cwd()).toLowerCase();

    // 3. Logika penentuan URL yang sinkron dengan app.php
    const appUrl = (env.APP_URL || env.URL_EXT || 'https://{folder}.test')
        .replace('{folder}', folderName);

    // Set variabel lingkungan agar Plugin Laravel bisa menampilkan URL yang benar di terminal
    process.env.APP_URL = appUrl;

    // 4. Konfigurasi SSL Laragon
    const isHttps = appUrl.startsWith('https');
    const keyPath = 'C:/laragon/etc/ssl/laragon.key';
    const certPath = 'C:/laragon/etc/ssl/laragon.crt';
    const hasCert = fs.existsSync(keyPath) && fs.existsSync(certPath);

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react(),
            tailwindcss(),
            wayfinder({
                formVariants: true, //Mempercepat startup awal Vite
            }),
        ],
        server: {
            // Menggunakan 0.0.0.0 agar server aset bisa diakses dari IP mana pun
            host: '0.0.0.0', 
            port: 5173,
            strictPort: true,
            // Menggunakan sertifikat SSL Laragon agar protokol sinkron (HTTPS)
            https: (isHttps && hasCert) ? {
                key: fs.readFileSync(keyPath),
                cert: fs.readFileSync(certPath),
            } : undefined,
            hmr: {
                // KUNCI UTAMA: Mengarahkan WebSocket ke domain .test agar tidak diblokir Mixed Content
                host: isHttps ? `${folderName}.test` : 'localhost',
                protocol: isHttps ? 'wss' : 'ws',
            },
        },
        esbuild: {
            jsx: 'automatic',
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/js'),
            },
        },
    };
});