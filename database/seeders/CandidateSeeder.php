<?php

namespace Database\Seeders;

use App\Models\Candidate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Candidate::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $candidates = [
            [
                'candidate_number' => 1,
                'ketua_name' => 'Haris Pratama',
                'wakil_name' => 'Lestari Indah',
                'vision' => 'Mewujudkan sekolah yang unggul, kreatif, dan berakhlak mulia melalui program-program inovatif dan kolaboratif.',
                'mission' => json_encode([
                    'Meningkatkan kualitas kegiatan ekstrakurikuler sebagai wadah pengembangan bakat.',
                    'Mengadakan acara rutin yang mempererat solidaritas antar siswa.',
                    'Menciptakan lingkungan sekolah yang bersih, aman, dan nyaman.',
                ]),
                'photo_path' => '/images/candidates/paslon1.png',
                // --- Data Saksi Paslon 1 ---
                'saksi1_name' => 'Saksi Satu A',
                'saksi1_class' => '12-RPL-1',
                'saksi2_name' => 'Saksi Satu B',
                'saksi2_class' => '12-TKJ-2',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'candidate_number' => 2,
                'ketua_name' => 'Bima Sakti',
                'wakil_name' => 'Ayu Lestari',
                'vision' => 'Menjadikan OSIS sebagai motor penggerak utama dalam menciptakan generasi siswa yang cerdas, berkarakter, dan peduli lingkungan.',
                'mission' => json_encode([
                    'Mengoptimalkan peran media sosial sekolah sebagai sarana informasi dan edukasi.',
                    'Menyelenggarakan kompetisi akademik dan non-akademik internal.',
                    'Membangun kerjasama dengan organisasi siswa dari sekolah lain.'
                ]),
                'photo_path' => '/images/candidates/paslon2.png',
                // --- Data Saksi Paslon 2 ---
                'saksi1_name' => 'Saksi Dua A',
                'saksi1_class' => '11-DKV-3',
                'saksi2_name' => 'Saksi Dua B',
                'saksi2_class' => '11-RPL-4',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'candidate_number' => 3,
                'ketua_name' => 'Candra Wijaya',
                'wakil_name' => 'Kirana Putri',
                'vision' => 'Terwujudnya siswa-siswi yang aktif, inspiratif, dan siap menghadapi tantangan global dengan berpegang pada nilai-nilai Pancasila.',
                'mission' => json_encode([
                    'Membuat program "Literasi Digital" untuk melawan berita hoaks.',
                    'Mengadakan workshop kewirausahaan untuk menumbuhkan jiwa bisnis siswa.',
                    'Memberikan apresiasi kepada siswa berprestasi setiap bulannya.'
                ]),
                'photo_path' => '/images/candidates/paslon3.png',
                // --- Data Saksi Paslon 3 ---
                'saksi1_name' => 'Saksi Tiga A',
                'saksi1_class' => '10-TJKT-1',
                'saksi2_name' => 'Saksi Tiga B',
                'saksi2_class' => '10-PPLG-2',
                'created_at' => now(), 'updated_at' => now(),
            ],
        ];

        Candidate::insert($candidates);
    }
}