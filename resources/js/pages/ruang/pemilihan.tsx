import React, { useState, useEffect } from 'react'; // 'useCallback' dihapus karena tidak lagi digunakan
import { Head, useForm } from '@inertiajs/react';

interface PemilihanProps {
    nomorRuang: number;
}

export default function Pemilihan({ nomorRuang }: PemilihanProps) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        nis_nip: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    // Kirim heartbeat secara berkala
    useEffect(() => {
        // --- FUNGSI DIPINDAHKAN KE DALAM USEEFFECT ---
        const sendHeartbeat = async () => {
            try {
                const response = await fetch(route('api.ruang.update.status'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                    body: JSON.stringify({ id: nomorRuang, action: 'heartbeat' }),
                });

                if (!response.ok) {
                    // Jika sesi berakhir (misalnya status 401), redirect
                    window.location.href = route('ruang.welcome');
                }
            } catch (error) {
                console.error("Heartbeat failed:", error);
                // Redirect jika koneksi terputus
                window.location.href = route('ruang.welcome');
            }
        };

        // Kirim heartbeat pertama kali saat komponen dimuat
        sendHeartbeat(); 
        
        const intervalId = setInterval(sendHeartbeat, 10000); // lalu setiap 10 detik
        
        // Membersihkan interval saat komponen dilepas
        return () => clearInterval(intervalId);
        
    }, [nomorRuang]); // <-- Cukup bergantung pada nomorRuang, karena fungsi sudah di dalam

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bilik.login'), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Voting Booth #${nomorRuang}`} />
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-pemilihan.jpg')" }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                
                <div className="relative w-full max-w-md bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8">
                    <header className="text-center mb-6">
                        <i className='bx bxs-user-check text-6xl text-cyan-400'></i>
                        <h1 className="text-3xl font-bold mt-2">Booth #{nomorRuang}</h1>
                        <p className="text-gray-400">Please enter your credentials to vote.</p>
                    </header>

                    {wasSuccessful && <div className="mb-4 text-center text-green-400">Login successful! Redirecting...</div>}
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="nis_nip" className="block text-sm font-medium text-gray-300">NIS / NIP</label>
                            <div className="mt-1">
                                <input
                                    id="nis_nip"
                                    name="nis_nip"
                                    type="text"
                                    autoComplete="off"
                                    required
                                    value={data.nis_nip}
                                    onChange={e => setData('nis_nip', e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                                {errors.nis_nip && <p className="text-red-400 text-xs mt-1">{errors.nis_nip}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
                                    <i className={showPassword ? 'bx bx-hide' : 'bx bx-show'}></i>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-all duration-300 disabled:bg-gray-500"
                            >
                                {processing ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}