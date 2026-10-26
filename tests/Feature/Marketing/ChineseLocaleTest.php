<?php

use App\Enums\ArticleStatus;
use App\Enums\UserRole;
use App\Support\LocaleTranslations;
use App\Support\LocaleUrl;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('chinese public pages expose translated navigation widgets and metadata', function () {
    $this->get('/zh/contact')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('locale', 'zh')
        ->where('translations.nav.home', '首页')
        ->where('translations.ui.close', '关闭')
        ->where('pageMeta.hreflang.zh', url('/zh/contact'))
        ->where('seo.locale', 'zh_CN')
    );
});

test('chinese backoffice selection translates login and enum options', function () {
    $this->withSession(['backoffice_locale' => 'zh'])->get('/login')
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'zh')
            ->where('translations.auth.submit', '登录')
            ->where('translations.ui.select', '请选择…')
        );
    app()->setLocale('zh');
    expect(ArticleStatus::Draft->label())->toBe('草稿')
        ->and(UserRole::Admin->label())->toBe('管理员');
});

test('language switches strip every supported prefix', function () {
    expect(LocaleUrl::localizePath('/zh/contact', 'en'))->toBe('/en/contact')
        ->and(LocaleUrl::localizePath('/en/contact', 'zh'))->toBe('/zh/contact')
        ->and(route('zh.contact', absolute: false))->toBe('/zh/contact');
});

test('chinese catalogs preserve source keys and replacement variables', function () {
    $verify = function (array $source, array $translated, string $path = '') use (&$verify): void {
        foreach ($source as $key => $value) {
            expect($translated)->toHaveKey($key);
            if (is_array($value)) {
                $verify($value, $translated[$key], $path.'.'.$key);
            } else {
                expect($translated[$key])->toBeString();
                if ($value !== '') {
                    expect($translated[$key])->not->toBe('');
                }
                preg_match_all('/:[a-zA-Z_]+|\{[a-zA-Z_]+\}/', $value, $sourceVars);
                preg_match_all('/:[a-zA-Z_]+|\{[a-zA-Z_]+\}/', $translated[$key], $targetVars);
                sort($sourceVars[0]);
                sort($targetVars[0]);
                expect($targetVars[0])->toBe($sourceVars[0]);
            }
        }
    };
    $verify(LocaleTranslations::loadMarketing('en'), LocaleTranslations::loadMarketing('zh'));
    $verify(LocaleTranslations::loadBackoffice('en'), LocaleTranslations::loadBackoffice('zh'));
});
