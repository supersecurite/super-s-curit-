<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Google reCAPTCHA
    |--------------------------------------------------------------------------
    |
    | Activez la protection des formulaires publics avec vos clés Google
    | reCAPTCHA v2 (case à cocher « Je ne suis pas un robot »).
    |
    */

    'enabled' => (bool) env('RECAPTCHA_ENABLED', false),

    'site_key' => env('RECAPTCHA_SITE_KEY'),

    'secret_key' => env('RECAPTCHA_SECRET_KEY'),

    'language' => env('RECAPTCHA_LANGUAGE', env('APP_LOCALE', 'fr')),

];
