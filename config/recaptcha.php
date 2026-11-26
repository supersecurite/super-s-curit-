<?php

/*
|--------------------------------------------------------------------------
| Google reCAPTCHA v2
|--------------------------------------------------------------------------
|
| Protection des formulaires publics (contact, candidature carrières).
| En local Herd (domaine .test), activez RECAPTCHA_USE_TEST_KEYS=true pour
| utiliser les clés de test Google (toujours valides, tout domaine).
| En production, enregistrez vos domaines (ex. supersecurite.com) sur la
| clé réelle dans la console Google reCAPTCHA.
|
| @see https://developers.google.com/recaptcha/docs/faq
|
*/

$useTestKeys = filter_var(
    env('RECAPTCHA_USE_TEST_KEYS', false),
    FILTER_VALIDATE_BOOLEAN
);

/** Clés de test Google — toujours acceptées, affichent un bandeau « for testing purposes ». */
$testSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
$testSecretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

return [

    'enabled' => (bool) env('RECAPTCHA_ENABLED', false),

    'use_test_keys' => $useTestKeys,

    'site_key' => $useTestKeys ? $testSiteKey : env('RECAPTCHA_SITE_KEY'),

    'secret_key' => $useTestKeys ? $testSecretKey : env('RECAPTCHA_SECRET_KEY'),

    'language' => env('RECAPTCHA_LANGUAGE', env('APP_LOCALE', 'fr')),

];
