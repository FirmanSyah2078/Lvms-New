<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nis_nip')->unique();
            $table->string('password'); // Password sebaiknya tidak nullable untuk keamanan
            $table->string('class');    // ex: "12-RPL-1", "Guru", "Staf"
            $table->string('gender');   // ex: "Male", "Female"
            
            // BARU: Kolom untuk melacak waktu absensi dan kedatangan secara terpisah
            $table->timestamp('morning_attendance_at')->nullable(); // Waktu Absen Pagi
            $table->timestamp('voting_attendance_at')->nullable();  // Waktu Kedatangan di bilik suara
            
            $table->boolean('has_voted')->default(false);
            $table->integer('queue_number')->unique()->nullable(); // Nomor antrian, nullable jika belum mendapatkan nomor antrian
            $table->timestamp('voted_at')->nullable();
            $table->timestamps(); // created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};