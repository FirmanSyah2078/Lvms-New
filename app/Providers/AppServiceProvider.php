<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /**
         * Memaksa Laravel untuk men-generate semua link (URL aset, route, vite) 
         * menggunakan protokol HTTPS jika konfigurasi URL aplikasi menggunakan https.
         * Ini krusial untuk mencegah masalah Mixed Content pada lingkungan SSL.
         */
        if (str_contains(config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }
    }
}