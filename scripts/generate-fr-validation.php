<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$sourceUrl = 'https://raw.githubusercontent.com/Laravel-Lang/lang/main/locales/fr/php.json';
$json = json_decode(file_get_contents($sourceUrl), true, 512, JSON_THROW_ON_ERROR);

$en = require $root.'/lang/en/validation.php';

$skip = ['failed', 'next', 'previous', 'reset', 'sent', 'throttle', 'throttled', 'token', 'user', 'password', 'attached', 'relatable'];

$result = [];

foreach ($en as $key => $value) {
    if (in_array($key, ['custom', 'attributes'], true)) {
        continue;
    }

    if (is_array($value)) {
        $result[$key] = [];

        foreach ($value as $subKey => $subValue) {
            $mapKey = $key.'.'.$subKey;
            $result[$key][$subKey] = $json[$mapKey] ?? $subValue;
        }

        continue;
    }

    $mapKey = $key;

    if ($key === 'password' && is_array($value)) {
        continue;
    }

    if (in_array($key, $skip, true)) {
        continue;
    }

    $result[$key] = $json[$mapKey] ?? $value;
}

if (isset($en['password']) && is_array($en['password'])) {
    $result['password'] = [];

    foreach ($en['password'] as $subKey => $subValue) {
        $mapKey = 'password.'.$subKey;
        $result['password'][$subKey] = $json[$mapKey] ?? $subValue;
    }
}

$result['custom'] = require $root.'/lang/fr/validation-custom.php';

$result['attributes'] = require $root.'/lang/fr/validation-attributes.php';

$export = var_export($result, true);
$export = str_replace('array (', '[', $export);
$export = preg_replace('/^\s*\)/m', ']', $export) ?? $export;
$export = str_replace(["\n)", "\r\n)"], "\n]", $export);

$content = "<?php\n\nreturn {$export};\n";

file_put_contents($root.'/lang/fr/validation.php', $content);

echo "Generated lang/fr/validation.php\n";
