<?php

// PERBAIKAN: Namespace harus sesuai dengan struktur folder
namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller; // Pastikan ini ada
use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // --- 1. Menghitung Statistik untuk Kartu ---
        $totalVoters = Voter::count();
        $votesCast = Voter::where('has_voted', true)->count();
        $remainingVoters = $totalVoters - $votesCast;
        $participationRate = ($totalVoters > 0) ? ($votesCast / $totalVoters) * 100 : 0;

        $stats = [
            'totalDpt' => $totalVoters,
            'totalBallotsCast' => $votesCast,
            'remainingVoters' => $remainingVoters,
            'participationRate' => round($participationRate, 1),
        ];

        // --- 2. Mengambil Data untuk Grafik Partisipasi Siswa ---
        $allVoters = Voter::where('class', '!=', 'Guru')->get();

        $participationData = $allVoters->groupBy('class')->map(function ($votersInClass) {
            $classParts = explode('-', $votersInClass->first()->class);
            $tingkatan = count($classParts) > 1 ? (int)$classParts[0] : 0;

            return [
                'namaKelas' => $votersInClass->first()->class,
                'tingkatan' => $tingkatan,
                'lakiSudahMemilih' => $votersInClass->where('gender', 'Male')->where('has_voted', true)->count(),
                'totalLaki' => $votersInClass->where('gender', 'Male')->count(),
                'perempuanSudahMemilih' => $votersInClass->where('gender', 'Female')->where('has_voted', true)->count(),
                'totalPerempuan' => $votersInClass->where('gender', 'Female')->count(),
            ];
        })->values()->all();

        // --- 3. Mengirim Semua Data ke Halaman React ---
        return Inertia::render('dashboard/Home', [
            'stats' => $stats,
            'participationData' => $participationData,
        ]);
    }
}