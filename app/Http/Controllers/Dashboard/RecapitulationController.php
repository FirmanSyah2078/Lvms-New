<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class RecapitulationController extends Controller
{
    /**
     * Menampilkan halaman recapitulation.
     */
    public function index()
    {

        return Inertia::render('dashboard/Recapitulation');
    }
}