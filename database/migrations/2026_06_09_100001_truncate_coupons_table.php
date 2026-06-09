<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('coupons')->truncate();
    }

    public function down(): void
    {
        // Data yang dihapus tidak bisa dikembalikan
    }
};
