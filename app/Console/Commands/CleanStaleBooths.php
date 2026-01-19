<?php

namespace App\Console\Commands;

use App\Models\Ruang;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CleanStaleBooths extends Command
{
    protected $signature = 'booths:clean';
    protected $description = 'Set status to offline for booths with no recent heartbeat (with verbose logging)';

    public function handle()
    {
        // 1. Catat waktu saat ini menurut Laravel (seharusnya UTC)
        $now = Carbon::now();
        $this->info("--------------------------------------------------");
        $this->info("Scheduler running. Current App Time (UTC): " . $now->toDateTimeString());

        // 2. Hitung batas waktu toleransi
        $staleThreshold = $now->copy()->subSeconds(30);
        $this->info("Stale Threshold (if heartbeat < this, it's stale): " . $staleThreshold->toDateTimeString());

        // 3. Ambil SEMUA bilik yang online untuk diperiksa
        $onlineBooths = Ruang::where('status', 'online')->get();

        if ($onlineBooths->isEmpty()) {
            $this->line("Result: No online booths found to check.");
            $this->info("--------------------------------------------------");
            return 0;
        }

        $this->line("Found {$onlineBooths->count()} online booth(s). Checking...");

        $cleanedCount = 0;
        foreach ($onlineBooths as $booth) {
            // 4. Tampilkan timestamp 'last_heartbeat' langsung dari database
            $this->line("-> Checking Booth #{$booth->id}:");
            $this->line("   Database last_heartbeat value is: " . $booth->last_heartbeat);

            // 5. Lakukan perbandingan dan beri tahu kita hasilnya
            if ($booth->last_heartbeat < $staleThreshold) {
                $this->warn("   Comparison result: Heartbeat is STALE. Setting to offline.");
                $booth->status = 'offline';
                $booth->logout_time = now();
                $booth->save();
                $cleanedCount++;
            } else {
                $this->comment("   Comparison result: Heartbeat is FRESH. Skipping.");
            }
        }

        $this->info("Check complete. {$cleanedCount} booth(s) were cleaned.");
        $this->info("--------------------------------------------------");

        return 0;
    }
}
