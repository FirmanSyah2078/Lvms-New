<?php

use App\Http\Controllers\RuangController;
use Illuminate\Support\Facades\Route;


Route::get('/ruang/welcome', [RuangController::class, 'welcome'])
    ->middleware(['auth']) 
    ->name('ruang.welcome');

Route::get('/ruang/{nomorRuang}', [RuangController::class, 'show'])
     ->where('nomorRuang', '[1-8]')
     ->name('ruang.show');

Route::prefix('api/ruang')->name('api.ruang.')->group(function () {
    Route::get('/status', [RuangController::class, 'getStatus'])->name('status');
    Route::post('/update-status', [RuangController::class, 'updateStatus'])->name('update.status');
});

Route::post('/bilik/login', [RuangController::class, 'handleBilikLogin'])->name('bilik.login');

Route::get('/vote', function () {
})->middleware(['auth:voter'])->name('voting.page'); 
