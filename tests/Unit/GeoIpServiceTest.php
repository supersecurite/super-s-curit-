<?php

use App\Services\GeoIpService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

uses(TestCase::class);

test('geoip uses cloudflare header without http call', function () {
    Http::fake();

    $result = app(GeoIpService::class)->resolve('127.0.0.1', 'GN');

    expect($result)->toBe([
        'country_code' => 'GN',
        'country' => 'Guinée',
    ]);

    Http::assertNothingSent();
});

test('geoip caches api lookup', function () {
    Cache::flush();

    Http::fake([
        'ip-api.com/*' => Http::response([
            'status' => 'success',
            'country' => 'France',
            'countryCode' => 'FR',
        ]),
    ]);

    $service = app(GeoIpService::class);

    $first = $service->resolve('8.8.8.8');
    $second = $service->resolve('8.8.8.8');

    expect($first)->toBe(['country_code' => 'FR', 'country' => 'France'])
        ->and($second)->toBe($first);

    Http::assertSentCount(1);
});

test('geoip returns null for private ips', function () {
    Http::fake();

    expect(app(GeoIpService::class)->resolve('127.0.0.1'))->toBeNull();

    Http::assertNothingSent();
});
