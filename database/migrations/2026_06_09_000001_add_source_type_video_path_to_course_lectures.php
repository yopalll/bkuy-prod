<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Idempotent: migrasi 2026_06_08_100001 mungkin sudah menambah kolom ini.
        // Tanpa guard, Schema::table di sini melempar "Duplicate column" dan
        // menggagalkan `migrate --force` saat deploy.
        Schema::table('course_lectures', function (Blueprint $table) {
            if (! Schema::hasColumn('course_lectures', 'source_type')) {
                $table->string('source_type', 20)->default('youtube')->after('title');
            }
            if (! Schema::hasColumn('course_lectures', 'video_path')) {
                $table->string('video_path', 500)->nullable()->after('source_type');
            }
        });

        // Backfill video_path dari kolom lama hanya jika masih kosong.
        if (Schema::hasColumn('course_lectures', 'url')) {
            DB::statement("UPDATE course_lectures SET video_path = url WHERE (video_path IS NULL OR video_path = '') AND url IS NOT NULL AND url != ''");
        }

        // Sanitasi duration sebelum ALTER TABLE: MySQL strict mode menolak
        // konversi string non-integer (misal "06:12") ke int unsigned.
        // "06:12" → 6 (ambil bagian sebelum ":"), "" atau format lain → NULL.
        DB::statement("
            UPDATE course_lectures
            SET duration = CASE
                WHEN duration REGEXP '^[0-9]+$'  THEN CAST(duration AS UNSIGNED)
                WHEN duration REGEXP '^[0-9]+:'  THEN CAST(SUBSTRING_INDEX(duration, ':', 1) AS UNSIGNED)
                ELSE NULL
            END
        ");

        Schema::table('course_lectures', function (Blueprint $table) {
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
