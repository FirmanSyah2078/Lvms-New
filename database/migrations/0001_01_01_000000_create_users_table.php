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
        // users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // username
            $table->string('password');
            $table->enum('role', ['admin', 'pengawas', 'ruang'])->default('ruang');
            $table->string('avatar')->nullable(); // ✅ HAPUS ->after('password')
            $table->rememberToken();
            $table->timestamps();
        });

        // password reset tokens (disesuaikan karena kamu tidak pakai email)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index(); // simpan username jika ingin fitur reset (opsional)
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // sessions (jika kamu pakai session driver 'database')
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            // user_id sebagai foreign key ke users (nullable agar tidak memblokir)
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};