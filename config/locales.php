<?php

return [

    'default' => 'fr',

    'supported' => ['fr', 'en', 'zh'],

    'labels' => [
        'fr' => 'Français',
        'en' => 'English',
        'zh' => '简体中文',
    ],

    'og_locales' => [
        'fr' => 'fr_FR',
        'en' => 'en_US',
        'zh' => 'zh_CN',
    ],

    /**
     * Prefixe URL pour les locales non-défaut.
     * Le français (défaut) n'a pas de préfixe.
     */
    'url_prefixes' => [
        'en' => 'en',
        'zh' => 'zh',
    ],

];
