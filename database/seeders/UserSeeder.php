<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✅ PERBAIKAN: Gunakan delete() bukan truncate() karena ada foreign key constraint
        User::query()->delete();

        // ✅ Reset auto increment (optional)
        DB::statement('ALTER TABLE users AUTO_INCREMENT = 1');

        // Buat data user menggunakan Model
        User::create([
            'name' => 'Admin',
            'password' => Hash::make('AdPass25'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Pengawas',
            'password' => Hash::make('PwPass'),
            'role' => 'pengawas'
        ]);

        User::create([
            'name' => 'Ruang',
            'password' => Hash::make('RgPass'),
            'role' => 'ruang'
        ]);
    }
}