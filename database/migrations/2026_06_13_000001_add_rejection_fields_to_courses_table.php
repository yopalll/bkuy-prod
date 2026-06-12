<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('status');
            }
            if (!Schema::hasColumn('courses', 'rejection_suggestion')) {
                $table->text('rejection_suggestion')->nullable()->after('rejection_reason');
            }
            if (!Schema::hasColumn('courses', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('rejection_suggestion');
            }
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['rejection_reason', 'rejection_suggestion', 'reviewed_at']);
        });
    }
};
