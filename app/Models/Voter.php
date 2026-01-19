<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voter extends Model
{ 
    
    use HasFactory; 

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'voters';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // Kolom yang mungkin Anda isi saat membuat voter baru
        'name',
        'nis_nip',
        'class',
        'gender',
        'password',
        
        // Kolom yang kita update melalui aksi di dashboard
        'has_voted',
        'voted_at',
        'morning_attendance_at',
        'voting_attendance_at',
        'queue_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'has_voted' => 'boolean', // Pastikan Laravel tahu ini adalah boolean
        'morning_attendance_at' => 'datetime',
        'voting_attendance_at' => 'datetime',
        'voted_at' => 'datetime',
    ];
}