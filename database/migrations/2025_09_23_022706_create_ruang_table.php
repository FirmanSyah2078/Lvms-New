<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ruang', function (Blueprint $table) {
            $table->id();
            $table->string('nama_bilik', 50)->unique();
            $table->enum('status', ['offline', 'online'])->default('offline');
            $table->string('ip_address', 45)->nullable();
            $table->string('device')->nullable(); // ✅ Kolom device baru
            $table->timestamp('last_active')->nullable()->useCurrent();
            $table->timestamp('login_time')->nullable();
            $table->timestamp('logout_time')->nullable();
            $table->string('user_login', 100)->nullable();
            $table->timestamp('last_heartbeat')->nullable();
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ruang');
    }
};