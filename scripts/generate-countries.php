<?php

/** One-off script: generates config/countries.php from ICU (intl). */
if (! extension_loaded('intl')) {
    fwrite(STDERR, "ext-intl required\n");
    exit(1);
}

$bundle = ResourceBundle::create('fr', 'ICUDATA-region');
$countries = [];

foreach ($bundle->get('Countries') as $code => $name) {
    if (! is_string($code) || strlen($code) !== 2 || ! ctype_alpha($code)) {
        continue;
    }

    $countries[strtoupper($code)] = (string) $name;
}

ksort($countries);

$export = var_export($countries, true);
$php = "<?php\n\n/**\n * ISO 3166-1 alpha-2 country names (French).\n * Generated via scripts/generate-countries.php — requires ext-intl.\n */\n\nreturn {$export};\n";

file_put_contents(__DIR__.'/../config/countries.php', $php);

echo count($countries)." countries written to config/countries.php\n";
