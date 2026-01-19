<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        // Kalau ruang, langsung render welcome
        if (Auth::check() && Auth::user()->role === 'ruang') {
            return Inertia::render('welcome');
        }

        // Admin/pengawas juga tetap render welcome
        return Inertia::render('welcome');
    }
}
