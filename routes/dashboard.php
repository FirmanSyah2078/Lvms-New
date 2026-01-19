<?php

use App\Http\Controllers\Dashboard\HomeController;
use App\Http\Controllers\Dashboard\DatabaseController;
use App\Http\Controllers\Dashboard\CallroomController;
use App\Http\Controllers\Dashboard\CandidatesController;
use App\Http\Controllers\Dashboard\RecapitulationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Grup untuk semua rute di dalam seksi Dashboard
Route::middleware(['auth'])->prefix('dashboard')->name('dashboard.')->group(function () {
    
    // URL: /dashboard/home
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    // --- GRUP UNTUK HALAMAN DATABASE ---
    
    // Rute utama untuk menampilkan halaman database (sudah ada)
    // URL: GET /dashboard/database
    Route::get('/database', [DatabaseController::class, 'index'])->name('database');

    // Grup baru untuk semua AKSI yang dilakukan di halaman database
    Route::prefix('database/{voter}')->name('database.')->controller(DatabaseController::class)->group(function () {
        
        // URL: POST /dashboard/database/{voter}/mark-morning-attendance
        Route::post('/mark-morning-attendance', 'markMorningAttendance')->name('mark-morning-attendance');

        // URL: POST /dashboard/database/{voter}/mark-voting-attendance
        Route::post('/mark-voting-attendance', 'markVotingAttendance')->name('mark-voting-attendance');

        // URL: POST /dashboard/database/{voter}/reset-voting
        Route::post('/reset-voting', 'resetVoting')->name('reset-voting');
        
        // URL: POST /dashboard/database/{voter}/reset-attendance
        Route::post('/reset-attendance', 'resetAttendance')->name('reset-attendance');

        // URL: POST /dashboard/database/{voter}/reassign-queue
        Route::post('/reassign-queue', 'reassignQueueNumber')->name('reassign-queue');

        // URL: DELETE /dashboard/database/{voter}
        Route::delete('/', 'destroy')->name('destroy');
    });

    // --- AKHIR GRUP DATABASE ---

    // URL: /dashboard/callroom
    Route::get('/callroom', [CallroomController::class, 'index'])->name('callroom');

    // URL: /dashboard/candidates
    Route::get('/candidates', [CandidatesController::class, 'index'])->name('candidates');

    // URL: /dashboard/recapitulation
    Route::get('/recapitulation', [RecapitulationController::class, 'index'])->name('recapitulation');
});