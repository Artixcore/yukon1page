<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Meta Pixel ID (Dataset ID)
    |--------------------------------------------------------------------------
    |
    | Your Facebook Pixel ID (Dataset ID) for client-side event tracking.
    | This is used to initialize the Meta Pixel on your website.
    |
    */

    'pixel_id' => env('META_PIXEL_ID'),

    /*
    |--------------------------------------------------------------------------
    | Meta Access Token
    |--------------------------------------------------------------------------
    |
    | Your Facebook Conversions API Access Token for server-side event tracking.
    | This token is used to send events directly to Facebook's Graph API.
    |
    */

    'access_token' => env('META_ACCESS_TOKEN'),

    /*
    |--------------------------------------------------------------------------
    | Meta Test Event Code
    |--------------------------------------------------------------------------
    |
    | Test Event Code for testing and debugging Conversions API events.
    | Use this code in Facebook Events Manager to view test events.
    |
    */

    'test_event_code' => env('META_TEST_EVENT_CODE'),

];
