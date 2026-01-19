import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import VantaBackground from '@/components/wl/VantaBackground';
import '../../../css/welcomeRuang.css';
import { simplifyUserAgent } from '@/lib/utils';

interface Ruang {
    id: number;
    nama_bilik: string;
    status: 'online' | 'offline';
    ip_address: string | null;
    device: string | null;
}

interface WelcomeProps {
    ruang: Ruang[]; // Meskipun kita harapkan array, bisa jadi undefined
}

const translateRoomName = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length < 2) return name;
    const translations: { [key: string]: string } = {
        'Satu': 'One', 'Dua': 'Two', 'Tiga': 'Three', 'Empat': 'Four',
        'Lima': 'Five', 'Enam': 'Six', 'Tujuh': 'Seven', 'Delapan': 'Eight'
    };
    return `Room ${translations[parts[1]] || parts[1]}`;
};

export default function Welcome({ ruang: initialRuang }: WelcomeProps) {
    // Inisialisasi state dengan data awal ATAU array kosong jika data tidak ada
    const [ruangList, setRuangList] = useState<Ruang[]>(initialRuang || []);
    const refreshInterval = 10000;

    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/ruang/status');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Pastikan data.ruang adalah array sebelum di-set
            if (Array.isArray(data.ruang)) {
                setRuangList(data.ruang);
            }
        } catch (error) {
            console.error('Failed to fetch room statuses:', error);
        }
    };

    const handleConfirm = (id: number) => {
        window.location.href = `/ruang/${id}`;
    };

    useEffect(() => {
        // Panggil fetchStatus saat komponen pertama kali dimuat
        // untuk mengisi data jika data awal kosong
        fetchStatus(); 
        const interval = setInterval(fetchStatus, refreshInterval);
        return () => clearInterval(interval);
    }, []);

    return (
        <VantaBackground>
            <Head>
                <title>Select a Voting Room</title>
            </Head>
            <div className="main-container-refined">
                <div className="welcome-header-wrapper">
                    <div className="header-text-content">
                        <h1 className="welcome-title-refined">Select a Voting Room</h1>
                        <p className="welcome-subtitle-refined">
                            Please select an available room to proceed with voting.
                        </p>
                    </div>
                    <Link href="/logout" method="post" as="button" className="logout-button-refined">
                        Logout
                    </Link>
                </div>

                <div className="grid-container-refined">
                    {/* ===== PERUBAHAN UTAMA DI SINI ===== */}
                    {/* Cek apakah ruangList ada DAN merupakan array sebelum di-map */}
                    {Array.isArray(ruangList) && ruangList.map((item) => {
                        const isOnline = item.status === 'online';
                        const statusGlowClass = isOnline ? 'status-glow-green' : 'status-glow-red';
                        const statusColorClass = isOnline ? 'text-green-400' : 'text-red-400';
                        const deviceSimple = simplifyUserAgent(item.device || 'Unknown Device');

                        return (
                            <div key={item.id} className="card-wrapper">
                                <div className="card-header">
                                    <h3 className="card-title">{translateRoomName(item.nama_bilik)}</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${statusGlowClass}`}></div>
                                        <span className={`text-xs font-semibold capitalize ${statusColorClass}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 my-4 space-y-2 border-t border-b border-white/10 py-3">
                                    <div className="flex justify-between items-center">
                                        <span>IP Address</span>
                                        <span className="font-medium text-gray-200">{item.ip_address || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Device</span>
                                        <span className="font-medium text-gray-200 truncate">
                                            {isOnline ? deviceSimple : '-'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleConfirm(item.id)}
                                        disabled={isOnline}
                                        className="button-primary text-sm"
                                    >
                                        {isOnline ? 'In Use' : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </VantaBackground>
    );
}