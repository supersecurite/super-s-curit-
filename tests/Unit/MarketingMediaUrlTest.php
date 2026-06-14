<?php

use App\Support\MarketingMediaUrl;

test('marketing media url resolves storage uploads', function () {
    expect(MarketingMediaUrl::resolve('articles/images/photo.jpg'))
        ->toBe('/storage/articles/images/photo.jpg')
        ->and(MarketingMediaUrl::source('articles/images/photo.jpg'))
        ->toBe('storage');
});

test('marketing media url resolves public assets', function () {
    expect(MarketingMediaUrl::resolve('/images/super-securite/pages/foo.jpg'))
        ->toBe('/images/super-securite/pages/foo.jpg')
        ->and(MarketingMediaUrl::resolve('images/super-securite/pages/foo.jpg'))
        ->toBe('/images/super-securite/pages/foo.jpg')
        ->and(MarketingMediaUrl::source('/images/super-securite/pages/foo.jpg'))
        ->toBe('public');
});

test('marketing media url resolves external urls', function () {
    expect(MarketingMediaUrl::resolve('https://example.com/a.jpg'))
        ->toBe('https://example.com/a.jpg')
        ->and(MarketingMediaUrl::source('https://example.com/a.jpg'))
        ->toBe('external');
});
