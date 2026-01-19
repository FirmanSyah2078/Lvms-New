<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Jadikan route utama ('/') lebih sederhana,
// logika redirect akan kita pindahkan ke HomeController.
Route::get('/', [PageController::class, 'index'])->name('home');

require __DIR__.'/dashboard.php';
require __DIR__.'/settings.php';
require __DIR__.'/pengawas.php';
require __DIR__.'/auth.php';
require __DIR__.'/ruang.php';