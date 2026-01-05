<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudflare Turnstile Configuration
    |--------------------------------------------------------------------------
    |
    | Cloudflare Turnstile is a privacy-first CAPTCHA alternative that
    | protects your site from spam and abuse without tracking users.
    |
    | Get your keys from: https://dash.cloudflare.com/
    | Navigate to: Turnstile → Add Site
    |
    */

    'site_key' => env('TURNSTILE_SITE_KEY', ''),

    'secret_key' => env('TURNSTILE_SECRET_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Widget Configuration
    |--------------------------------------------------------------------------
    |
    | Theme options: 'light', 'dark', 'auto'
    | Size options: 'normal', 'compact'
    | Language: 'auto' or specific language code (e.g., 'bn' for Bengali)
    |
    */

    'theme' => env('TURNSTILE_THEME', 'light'),

    'size' => env('TURNSTILE_SIZE', 'normal'),

    'language' => env('TURNSTILE_LANGUAGE', 'auto'),

    /*
    |--------------------------------------------------------------------------
    | Verification Endpoint
    |--------------------------------------------------------------------------
    |
    | Cloudflare Turnstile verification endpoint
    |
    */

    'verify_url' => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',

    /*
    |--------------------------------------------------------------------------
    | Validation Settings
    |--------------------------------------------------------------------------
    |
    | Enable IP address validation for additional security
    |
    */

    'validate_ip' => env('TURNSTILE_VALIDATE_IP', true),

];
