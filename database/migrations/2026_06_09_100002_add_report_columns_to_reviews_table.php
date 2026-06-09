<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->text('report_reason')->nullable()->after('status');
            $table->timestamp('reported_at')->nullable()->after('report_reason');
            $table->unsignedTinyInteger('report_count')->default(0)->after('reported_at');
        });

        // Auto-approve semua review yang pending
        DB::table('reviews')->where('status', 'pending')->update(['status' => 'approved']);
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn(['report_reason', 'reported_at', 'report_count']);
        });
    }
};
