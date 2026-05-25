<?php

return [

    'email' => env('ARISTECH_CONTACT_EMAIL', 'contact@aristechguinee.com'),

    'phone' => env('ARISTECH_CONTACT_PHONE', '+224 621 630 916'),

    'phone_href' => env('ARISTECH_CONTACT_PHONE_HREF', 'tel:+224621630916'),

    'social' => [
        'facebook' => env('ARISTECH_FACEBOOK_URL'),
        'twitter' => env('ARISTECH_TWITTER_URL'),
        'instagram' => env('ARISTECH_INSTAGRAM_URL'),
    ],

    'mail_to' => env('ARISTECH_MAIL_TO', env('ARISTECH_CONTACT_EMAIL', 'contact@aristechguinee.com')),

];
