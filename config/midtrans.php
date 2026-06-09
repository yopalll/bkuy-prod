<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Midtrans Server Key
    |--------------------------------------------------------------------------
    |
    | Your Midtrans Server Key from the sandbox/production dashboard.
    | Used for server-side API calls (creating transactions, etc.)
    |
    */
    'server_key' => env('MIDTRANS_SERVER_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Midtrans Client Key
    |--------------------------------------------------------------------------
    |
    | Your Midtrans Client Key from the sandbox/production dashboard.
    | Used for frontend Snap.js integration.
    |
    */
    'client_key' => env('MIDTRANS_CLIENT_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Production Mode
    |--------------------------------------------------------------------------
    |
    | ALWAYS false for this project (non-commercial academic project).
    | This determines whether to use sandbox or production API endpoints.
    |
    */
    'is_production' => false, // HARDCODED — JANGAN ubah ke true

    /*
    |--------------------------------------------------------------------------
    | Sanitized Mode
    |--------------------------------------------------------------------------
    |
    | When enabled, Midtrans will sanitize the request parameters.
    |
    */
    'is_sanitized' => true,

    /*
    |--------------------------------------------------------------------------
    | 3DS Mode
    |--------------------------------------------------------------------------
    |
    | Enable 3D Secure authentication for credit card transactions.
    |
    */
    'is_3ds' => true,

    /*
    |--------------------------------------------------------------------------
    | Merchant ID
    |--------------------------------------------------------------------------
    |
    | Your Midtrans Merchant ID.
    |
    */
    'merchant_id' => env('MIDTRANS_MERCHANT_ID', ''),

];
