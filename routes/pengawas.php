<?php
// File: routes/pengawas.php
use App\Http\Controllers\PengawasController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('pengawas')->name('pengawas.')->group(function () {
    
    Route::get('/', [PengawasController::class, 'index'])->name('index'); // <-- nama: pengawas.index

    Route::post('/action', [PengawasController::class, 'handleAction'])->name('action'); // <-- nama: pengawas.action
});