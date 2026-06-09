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
            $table->enum('source_type', ['youtube', 'gcs'])->default('youtube')->after('title');
            $table->string('video_path', 1000)->nullable()->after('source_type');
        });

        // Backfill dari kolom lama (video_type + url)
        // YouTube: normalkan URL ke embed format https://www.youtube.com/embed/{id}
        $rows = DB::table('course_lectures')->whereNotNull('url')->get(['id', 'video_type', 'url']);

        foreach ($rows as $row) {
            $sourceType = 'gcs'; // default untuk cloudinary/local → perlu upload ulang ke GCS
            $videoPath  = null;

            if ($row->video_type === 'youtube' || $row->video_type === null) {
                // Ekstrak YouTube ID dari berbagai format URL
                $youtubeId = self::extractYoutubeId($row->url ?? '');

                if ($youtubeId) {
                    $sourceType = 'youtube';
                    $videoPath  = 'https://www.youtube.com/embed/' . $youtubeId;
                }
            }
            // cloudinary / local → source_type='gcs', video_path=null (tandai untuk upload ulang)

            DB::table('course_lectures')
                ->where('id', $row->id)
                ->update([
                    'source_type' => $sourceType,
                    'video_path'  => $videoPath,
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('course_lectures', function (Blueprint $table) {
            $table->dropColumn(['source_type', 'video_path']);
        });
    }

    private static function extractYoutubeId(string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        // Tangani ID 11-karakter polos (tanpa penanda)
        if (preg_match('/^([\w-]{11})$/', $url, $m)) {
            return $m[1];
        }

        // Tangani berbagai format URL YouTube
        if (preg_match(
            '/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?(?:[^#]*&)?v=|v\/|shorts\/))([\w-]{11})/',
            $url,
            $m
        )) {
            return $m[1];
        }

        return null;
    }
};
