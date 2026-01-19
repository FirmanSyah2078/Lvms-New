<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\Voter;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DatabaseController extends Controller
{
    /**
     * Menampilkan halaman utama database dengan semua data pemilih.
     */
    public function index()
    {
        // Cari nomor antrian yang hilang/kosong
        $votersWithQueue = Voter::whereNotNull('queue_number')->orderBy('queue_number')->pluck('queue_number');
        $maxQueue = $votersWithQueue->max();
        $missingQueueNumbers = [];
        if ($maxQueue) {
            $allPossibleNumbers = range(1, $maxQueue);
            $missingQueueNumbers = collect($allPossibleNumbers)->diff($votersWithQueue)->values()->all();
        }

        // Ambil semua data pemilih dan coba dekripsi password dengan aman
        $voters = Voter::orderBy('name')->get()->map(function ($voter) {
            if (!empty($voter->password) && is_string($voter->password)) {
                try {
                    $voter->plain_text_password = Crypt::decryptString($voter->password);
                } catch (DecryptException $e) {
                    // Jika gagal dekripsi (misalnya data lama/rusak), beri tanda error
                    $voter->plain_text_password = 'Invalid Key';
                }
            } else {
                // Jika password kosong atau tidak ada
                $voter->plain_text_password = 'Not Set';
            }
            return $voter;
        });

        // Ambil kategori dan lakukan pengurutan kustom (teks dulu, baru angka)
        $allCategories = Voter::select('class')->distinct()->pluck('class');

        $textCategories = $allCategories->filter(function ($category) {
            return !is_numeric(substr($category, 0, 1));
        })->sort()->values();
        
        $numericCategories = $allCategories->filter(function ($category) {
            return is_numeric(substr($category, 0, 1));
        })->sort(SORT_NATURAL)->values();
        
        $categories = $textCategories->merge($numericCategories);

        return Inertia::render('dashboard/Database', [
            'voters' => $voters,
            'missingQueueNumbers' => $missingQueueNumbers,
            'categories' => $categories
        ]);
    }

    /**
     * Menandai kehadiran pagi (morning attendance).
     */
    public function markMorningAttendance(Voter $voter)
    {
        if ($voter->morning_attendance_at) {
            return back()->with('error', 'Morning attendance has already been marked.');
        }

        $voter->update(['morning_attendance_at' => now()]);

        return back()->with('success', 'Morning attendance marked successfully.');
    }

    /**
     * Menandai kehadiran memilih (voting attendance) dan membuat nomor antrian.
     */
    public function markVotingAttendance(Voter $voter)
    {
        if ($voter->voting_attendance_at || $voter->queue_number) {
            return back()->with('error', 'Voting attendance has already been marked.');
        }

        try {
            DB::transaction(function () use ($voter) {
                $maxQueueNumber = Voter::max('queue_number');
                $newQueueNumber = $maxQueueNumber + 1;

                $voter->update([
                    'voting_attendance_at' => now(),
                    'queue_number'         => $newQueueNumber,
                ]);
            });
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to mark attendance. Please try again.');
        }
        
        return back()->with('success', 'Voting attendance marked successfully. Queue No: ' . ($voter->fresh()->queue_number));
    }

    /**
     * Menugaskan ulang nomor antrian spesifik ke seorang pemilih.
     */
    public function reassignQueueNumber(Request $request, Voter $voter)
    {
        $request->validate([
            'queue_number' => 'required|integer|min:1',
        ]);

        $newQueueNumber = $request->input('queue_number');

        if ($voter->has_voted) {
            return back()->with('error', 'This voter has already voted.');
        }

        if ($voter->queue_number) {
            return back()->with('error', 'This voter already has a queue number. Please reset it first.');
        }

        $isTaken = Voter::where('queue_number', $newQueueNumber)->exists();
        if ($isTaken) {
            return back()->with('error', "Queue number {$newQueueNumber} is already taken.");
        }

        $voter->update([
            'voting_attendance_at' => now(),
            'queue_number'         => $newQueueNumber,
        ]);

        return back()->with('success', "Successfully assigned queue number {$newQueueNumber} to {$voter->name}.");
    }
    
    /**
     * Mereset status voting pemilih.
     */
    public function resetVoting(Voter $voter)
    {
        if (!$voter->has_voted) {
            return back()->with('error', 'This voter has not voted yet.');
        }

        $voter->update([
            'has_voted' => false,
            'voted_at'  => null,
        ]);

        return back()->with('success', 'Voting status has been reset.');
    }

    /**
     * Mereset semua data absensi dan nomor antrian.
     */
    public function resetAttendance(Voter $voter)
    {
        if ($voter->has_voted) {
            return back()->with('error', 'Cannot reset attendance for a voter who has already voted. Reset voting status first.');
        }
        
        $voter->update([
            'morning_attendance_at' => null,
            'voting_attendance_at'  => null,
            'queue_number'          => null,
        ]);

        return back()->with('success', 'All attendance data has been reset.');
    }

    /**
     * Menghapus data pemilih dari database.
     */
    public function destroy(Voter $voter)
    {
        try {
            $voter->delete();
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete voter.');
        }

        return redirect()->route('dashboard.database')->with('success', 'Voter has been deleted successfully.');
    }
}