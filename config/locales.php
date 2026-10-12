<?php

return [

    'default' => env('APP_LOCALE', 'fr'),

    'supported' => ['fr', 'en'],

    'labels' => [
        'fr' => 'Français',
        'en' => 'English',
    ],

    'og_locales' => [
        'fr' => 'fr_FR',
        'en' => 'en_US',
    ],

    /**
     * Prefixe URL pour les locales non-défaut.
     * Le français (défaut) n'a pas de préfixe.
     */
    'url_prefixes' => [
        'en' => 'en',
    ],

];
