<?php

namespace App\Services;

use Google\Cloud\Storage\StorageClient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class GcsVideoService
{
    private StorageClient $client;
    private \Google\Cloud\Storage\Bucket $bucket;

    public function __construct()
    {
        $this->client = new StorageClient([
            'keyFilePath' => base_path(config('gcp.key_file_path')),
            'projectId'   => config('gcp.project_id'),
        ]);

        $this->bucket = $this->client->bucket(config('gcp.bucket'));
    }

    /**
     * Upload video ke GCS sebagai objek privat.
     * Mengembalikan nama objek (video_path) yang disimpan di DB.
     */
    public function upload(\Illuminate\Http\UploadedFile $file, int $courseId): string
    {
        $ext        = $file->getClientOriginalExtension();
        $objectName = "lectures/{$courseId}/" . Str::uuid() . ".{$ext}";

        $stream = fopen($file->getRealPath(), 'r');

        try {
            // CATATAN: jangan kirim 'predefinedAcl'. Bucket dengan Uniform
            // Bucket-Level Access (UBLA — default GCS) MENOLAK ACL objek dengan
            // error 400 "Cannot insert legacy ACL ... uniform bucket-level access
            // is enabled", sehingga setiap upload gagal. Privasi dijaga di level
            // bucket (UBLA + IAM); akses video disajikan lewat signedUrl().
            $this->bucket->upload($stream, [
                'name' => $objectName,
            ]);
        } catch (\Throwable $e) {
            Log::error('GCS upload gagal', [
                'object'  => $objectName,
                'bucket'  => config('gcp.bucket'),
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException('Upload video ke GCS gagal: ' . $e->getMessage(), 0, $e);
        } finally {
            if (is_resource($stream)) {
                fclose($stream);
            }
        }

        return $objectName;
    }

    /**
     * Generate v4 Signed URL yang berlaku 1 jam (private, tidak bisa didownload).
     */
    public function signedUrl(string $objectName): string
    {
        $object = $this->bucket->object($objectName);

        return $object->signedUrl(
            new \DateTime('+1 hour'),
            ['version' => 'v4']
        );
    }

    /**
     * Hapus objek lama dari GCS. Gagal silent agar tidak memblokir request utama.
     */
    public function delete(string $objectName): void
    {
        try {
            $this->bucket->object($objectName)->delete();
        } catch (\Throwable) {
            // silent — jangan gagalkan request karena cleanup error
        }
    }

    /**
     * Cek apakah GCS sudah dikonfigurasi (bucket + key file tersedia).
     */
    public static function isConfigured(): bool
    {
        $bucket  = config('gcp.bucket');
        $keyPath = base_path(config('gcp.key_file_path'));

        return !empty($bucket) && file_exists($keyPath);
    }
}
