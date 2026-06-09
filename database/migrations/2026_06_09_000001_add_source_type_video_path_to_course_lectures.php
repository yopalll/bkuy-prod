<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('course_lectures', function (Blueprint $table) {
            $table->string('source_type', 20)->default('youtube')->after('title');
            $table->string('video_path', 500)->nullable()->after('source_type');
        });

        // Migrate url → video_path untuk data existing
        DB::statement("UPDATE course_lectures SET video_path = url WHERE url IS NOT NULL AND url != ''");

        Schema::table('course_lectures', function (Blueprint $table) {
            // Ubah duration dari string ke integer (MySQL cast "06:12" → 6)
            $table->unsignedInteger('duration')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('course_lectures', function (Blueprint $table) {
            $table->dropColumn(['source_type', 'video_path']);
            $table->string('duration', 50)->nullable()->change();
        });
    }
};
