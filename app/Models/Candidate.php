<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'candidate_number',
        'ketua_name',
        'wakil_name',
        'vision',
        'mission',
        'photo_path',
        'saksi1_name',   // <-- Ditambahkan
        'saksi1_class',  // <-- Ditambahkan
        'saksi2_name',   // <-- Ditambahkan
        'saksi2_class',  // <-- Ditambahkan
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'mission' => 'array',
    ];
}