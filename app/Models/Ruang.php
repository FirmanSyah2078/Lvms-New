<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruang extends Model
{
    use HasFactory;

    protected $table = 'ruang';

    protected $fillable = [
        'nama_bilik',
        'status',
        'ip_address',
        'device',
        'last_active',
        'login_time',
        'logout_time',
        'user_login',
        'last_heartbeat',
    ];
}