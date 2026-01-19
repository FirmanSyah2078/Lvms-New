<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CallroomController extends Controller
{
    /**
     * Menampilkan halaman callroom.
     */
    public function index()
    {
        
        return Inertia::render('dashboard/Callroom');
    }
}