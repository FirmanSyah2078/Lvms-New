<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('candidate_number')->unique();
            
            $table->string('ketua_name');
            $table->string('wakil_name');
            
            $table->text('vision');
            $table->json('mission');
            
            $table->string('photo_path')->nullable();

            // --- PENAMBAHAN KOLOM SAKSI ---
            $table->string('saksi1_name');
            $table->string('saksi1_class');
            $table->string('saksi2_name');
            $table->string('saksi2_class');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};