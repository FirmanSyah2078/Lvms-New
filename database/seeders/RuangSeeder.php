<?php

namespace Database\Seeders;

use App\Models\Ruang; // Gunakan model untuk cara yang lebih rapi
use Illuminate\Database\Seeder;

class RuangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✅ BARIS PENTING: Mengosongkan semua data di tabel 'ruang' sebelum diisi ulang.
        Ruang::truncate();

        // Data bilik yang akan dimasukkan kembali
        $ruangData = [
            ['nama_bilik' => 'Ruang Satu'],
            ['nama_bilik' => 'Ruang Dua'],
            ['nama_bilik' => 'Ruang Tiga'],
            ['nama_bilik' => 'Ruang Empat'],
            ['nama_bilik' => 'Ruang Lima'],
            ['nama_bilik' => 'Ruang Enam'],
            ['nama_bilik' => 'Ruang Tujuh'],
            ['nama_bilik' => 'Ruang Delapan'],
        ];

        // Looping untuk memasukkan data dengan status 'offline'
        foreach ($ruangData as $data) {
            Ruang::create([
                'nama_bilik' => $data['nama_bilik'],
                'status' => 'offline', // Status default saat reset
                'device' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}


