<?php

use App\Support\InternationalPhoneNumber;

test('normalizes international phone numbers with formatting characters', function () {
    expect(InternationalPhoneNumber::normalize('+1 (555) 670-8636'))->toBe('+15556708636')
        ->and(InternationalPhoneNumber::normalize('+224 622 999 888'))->toBe('+224622999888')
        ->and(InternationalPhoneNumber::normalize('+33-1-23-45-67-89'))->toBe('+33123456789');
});

test('rejects phone numbers without international prefix', function () {
    expect(InternationalPhoneNumber::normalize('622999888'))->toBeNull()
        ->and(InternationalPhoneNumber::normalize('(555) 670-8636'))->toBeNull();
});

test('rejects incomplete international phone numbers', function () {
    expect(InternationalPhoneNumber::normalize('+1'))->toBeNull()
        ->and(InternationalPhoneNumber::normalize('+224'))->toBeNull()
        ->and(InternationalPhoneNumber::normalize('+0123456789'))->toBeNull();
});
