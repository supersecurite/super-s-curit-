<?php

/**
 * Builds config/countries.php (ISO 3166-1 alpha-2 → French names).
 * Run: php scripts/build-countries-config.php
 */

$jsonPath = __DIR__.'/../storage/app/iso-countries-slim-2.json';

if (! file_exists($jsonPath)) {
    $json = file_get_contents(
        'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-2/slim-2.json',
    );

    if ($json === false) {
        fwrite(STDERR, "Download failed. Place JSON at storage/app/iso-countries-slim-2.json\n");
        exit(1);
    }

    @mkdir(dirname($jsonPath), 0755, true);
    file_put_contents($jsonPath, $json);
}

/** @var list<array{name: string, alpha-2: string}> $entries */
$entries = json_decode(file_get_contents($jsonPath), true, 512, JSON_THROW_ON_ERROR);

/** @var array<string, string> $fr */
$fr = require __DIR__.'/../database/data/countries-fr.php';

$out = [];

foreach ($entries as $row) {
    $code = $row['alpha-2'];
    $out[$code] = $fr[$code] ?? $row['name'];
}

$out['XK'] ??= 'Kosovo';

ksort($out);

$content = "<?php\n\n/**\n * ISO 3166-1 alpha-2 → nom du pays (français).\n *\n * @var array<string, string>\n */\nreturn ".var_export($out, true).";\n";

file_put_contents(__DIR__.'/../config/countries.php', $content);

echo count($out)." countries → config/countries.php\n";
