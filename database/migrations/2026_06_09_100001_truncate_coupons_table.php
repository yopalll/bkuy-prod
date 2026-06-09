<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Null-kan coupon_id di orders dulu agar FK tidak block delete
        DB::table('orders')->update(['coupon_id' => null]);
        DB::table('coupons')->delete();
    }

    public function down(): void
    {
        // Data yang dihapus tidak bisa dikembalikan
    }
};
