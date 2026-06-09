<?php

return [
    'bucket'        => env('GCP_BUCKET_NAME'),
    'key_file_path' => env('GCP_KEY_FILE_PATH', 'storage/app/gcp/service-account.json'),
    'project_id'    => env('GCP_PROJECT_ID'),
];
