<?php

namespace App\Services;

use Google\Cloud\Storage\StorageClient;
use Illuminate\Support\Str;

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

        $this->bucket->upload($stream, [
            'name'          => $objectName,
            'predefinedAcl' => 'projectPrivate',
        ]);

        if (is_resource($stream)) {
            fclose($stream);
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
