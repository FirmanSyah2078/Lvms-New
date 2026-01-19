<?php

namespace App\Http\Controllers;

use App\Models\Ruang;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Tambahkan ini
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RuangController extends Controller
{
    public function welcome()
    {
        return Inertia::render('ruang/welcome', [
            'ruang' => Ruang::all(),
        ]);
    }

    public function show($nomorRuang)
    {
        // Hapus pengecekan Auth di sini. Halaman ini adalah halaman login publik untuk pemilih.
        return Inertia::render('ruang/pemilihan', [
            'nomorRuang' => $nomorRuang
        ]);
    }

    public function getStatus()
    {
        return response()->json(Ruang::all());
    }
    
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:ruang,id',
            'action' => 'required|in:online,offline,heartbeat',
        ]);

        $ruang = Ruang::find($validated['id']);

        switch ($validated['action']) {
            case 'online':
                if ($ruang->status === 'online') {
                    return response()->json(['success' => false, 'message' => 'Ruang ini sudah digunakan.'], 409);
                }
                $ruang->status = 'online';
                $ruang->ip_address = $request->ip();
                $ruang->device = $request->userAgent();
                $ruang->login_time = now();
                $ruang->last_heartbeat = now();
                break;
            
            case 'offline':
                $ruang->status = 'offline';
                $ruang->logout_time = now();
                break;

            case 'heartbeat':
                if ($ruang->status !== 'online') {
                    return response()->json(['success' => false, 'message' => 'Sesi telah berakhir.'], 401);
                }
                $ruang->last_heartbeat = now();
                break;
        }
        
        $ruang->save();
        return response()->json(['success' => true, 'message' => 'Status berhasil diperbarui.']);
    }

    /**
     * Menangani proses login dari pemilih di dalam bilik suara.
     */
    public function handleBilikLogin(Request $request)
    {
        $request->validate([
            'nis_nip' => 'required|string',
            'password' => 'required|string',
        ]);

        $voter = Voter::where('nis_nip', $request->nis_nip)->first();

        // Cek jika pemilih tidak ditemukan
        if (!$voter) {
            throw ValidationException::withMessages([
                'nis_nip' => 'NIS/NIP tidak terdaftar.',
            ]);
        }

        // Cek jika password salah
        try {
            if (Crypt::decryptString($voter->password) !== $request->password) {
                throw new \Exception('Password mismatch');
            }
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'password' => 'Password yang Anda masukkan salah.',
            ]);
        }

        // Cek jika pemilih sudah memilih sebelumnya
        if ($voter->has_voted) {
            // ✅ Gunakan ValidationException untuk konsistensi error
            throw ValidationException::withMessages([
                'nis_nip' => 'Akun ini sudah digunakan untuk memilih.',
            ]);
        }

        // ✅ 1. Jika semua validasi berhasil, login pemilih ke dalam sesi
        Auth::guard('voter')->login($voter);

        // ✅ 2. Buat redirect di sisi server ke halaman pemilihan kandidat
        // Ganti 'voting.page' dengan nama rute halaman pemilihan kandidat Anda
        return Inertia::location(route('voting.page'));
    }
}