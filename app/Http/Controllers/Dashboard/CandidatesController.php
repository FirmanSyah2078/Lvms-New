<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CandidatesController extends Controller
{
    /**
     * Menampilkan halaman candidates.
     */
    public function index()
    {
        
        return Inertia::render('dashboard/Candidates');
    }
}