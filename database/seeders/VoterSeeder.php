<?php

namespace Database\Seeders;

use App\Models\Voter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; // ✅ 1. Tambahkan use statement untuk Str

class VoterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kosongkan tabel sebelum seeding
        Voter::query()->delete();
        
        // Reset auto-increment untuk MySQL
        DB::statement('ALTER TABLE voters AUTO_INCREMENT = 1');

        // === DATA STATIS UNTUK GURU & KARYAWAN ===
        $staffAndTeachers = [
            // Data Guru
            ['name' => 'Ahmad Fauzi, S.Pd.', 'nis_nip' => '990001', 'class' => 'Guru', 'gender' => 'Male'],
            ['name' => 'Siti Aminah, M.Pd.', 'nis_nip' => '990002', 'class' => 'Guru', 'gender' => 'Female'],
            ['name' => 'Budi Santoso, S.Kom.', 'nis_nip' => '990003', 'class' => 'Guru', 'gender' => 'Male'],

            // Data Karyawan
            ['name' => 'Karyawan Pria 1', 'nis_nip' => '880001', 'class' => 'Karyawan', 'gender' => 'Male'],
            ['name' => 'Karyawan Wanita 1', 'nis_nip' => '880002', 'class' => 'Karyawan', 'gender' => 'Female'],
        ];

        foreach ($staffAndTeachers as $person) {
            Voter::create([
                'name' => $person['name'],
                'nis_nip' => $person['nis_nip'],
                // ✅ 2. Gunakan helper Str untuk password
                'password' => Crypt::encryptString(strtoupper(Str::random(6))),
                'class' => $person['class'],
                'gender' => $person['gender'],
            ]);
        }

        // === DATA DINAMIS UNTUK SISWA MENGGUNAKAN LOOPING ===
        $nisCounter = 100001;

        // Kelas 10 (10-1 s/d 10-12)
        for ($i = 1; $i <= 12; $i++) {
            Voter::create([
                'name' => "Siswa Laki 10-{$i}",
                'nis_nip' => $nisCounter++,
                'password' => Crypt::encryptString(strtoupper(Str::random(6))),
                'class' => "10-{$i}",
                'gender' => 'Male',
            ]);
            Voter::create([
                'name' => "Siswa Perempuan 10-{$i}",
                'nis_nip' => $nisCounter++,
                'password' => Crypt::encryptString(strtoupper(Str::random(6))),
                'class' => "10-{$i}",
                'gender' => 'Female',
            ]);
        }
        
        // Kelas 11 (11-1 s/d 11-11)
        for ($i = 1; $i <= 11; $i++) {
            Voter::create([
                'name' => "Siswa Laki 11-{$i}",
                'nis_nip' => $nisCounter++,
                'password' => Crypt::encryptString(strtoupper(Str::random(6))),
                'class' => "11-{$i}",
                'gender' => 'Male',
            ]);
            Voter::create([
                'name' => "Siswa Perempuan 11-{$i}",
                'nis_nip' => $nisCounter++,
                'password' => Crypt::encryptString(strtoupper(Str::random(6))),
                'class' => "11-{$i}",
                'gender' => 'Female',
            ]);
        }

        // Kelas 12 (12-1 s/d 12-11)
        for ($i = 1; $i <= 11; $i++) {
            Voter::create([
                'name' => "Siswa Laki 12-{$i}",
                'nis_nip' => $nisCounter++,
                'password' => Crypt::encryptString(strtoupper(Str::random(6))),
                'class' => "12-{$i}",
                'gender' => 'Male',
            ]);
            Voter::create([
                'name' => "Siswa Perempuan 12-{$i}",
                'nis_nip' => $nisCounter++,
                'password' => Crypt::encryptString(strtoupper(Str::random(6))),
                'class' => "12-{$i}",
                'gender' => 'Female',
            ]);
        }
    }
}