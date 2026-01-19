<?php

namespace App\Http\Controllers;

use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengawasController extends Controller
{
    /**
     * Menampilkan halaman dashboard utama untuk pengawas.
     */
    public function index(): Response
    {
        $peserta = Voter::query()
            ->select(
                'id',
                'name as nama_lengkap',
                'nis_nip',
                'class',
                'queue_number as no_antrian',
                'has_voted',
                'morning_attendance_at',
                'voting_attendance_at'
            )
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function ($voter) {
                $voter->status = $voter->has_voted ? 'Voted' : 'Not Voted';
                $voter->sudah_absen = !is_null($voter->morning_attendance_at);
                $voter->sudah_hadir = !is_null($voter->voting_attendance_at);
                $voter->kategori = $voter->class;
                return $voter;
            });

        return Inertia::render('pengawas/index', [
            'peserta' => $peserta,
        ]);
    }

    /**
     * Menangani aksi dari halaman pengawas.
     */
    public function handleAction(Request $request)
    {
        // ✅ PERBAIKAN: Ganti validasi 'delete' menjadi 'reset'
        $request->validate([
            'id' => 'required|exists:voters,id',
            'action' => 'required|in:absen,hadir,reset',
        ]);

        $voter = Voter::findOrFail($request->id);

        if ($voter->has_voted) {
            return back()->with('error', 'Tidak dapat mengubah data pemilih yang sudah vote.');
        }

        switch ($request->action) {
            case 'absen':
                $voter->morning_attendance_at = now();
                break;
            case 'hadir':
                $voter->voting_attendance_at = now();
                // Logika pembuatan nomor antrian kita pindahkan ke sini juga
                // agar konsisten dan terpusat.
                if (is_null($voter->queue_number)) {
                    $maxQueueNumber = Voter::max('queue_number');
                    $voter->queue_number = $maxQueueNumber + 1;
                }
                break;
            case 'reset': // ✅ PERBAIKAN: Ganti dari 'delete' ke 'reset'
                $voter->morning_attendance_at = null;
                $voter->voting_attendance_at = null;
                // ✅ SOLUSI UTAMA: Tambahkan baris ini untuk mereset nomor antrian
                $voter->queue_number = null;
                break;
        }

        $voter->save();

        return back()->with('success', 'Status pemilih berhasil diperbarui.');
    }
}