<?php

use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\SecurityTipController as AdminSecurityTipController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Marketing\ArticleController as MarketingArticleController;
use App\Http\Controllers\Marketing\SecurityTipController as MarketingSecurityTipController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\TrackVisit;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;

Route::get('/robots.txt', RobotsController::class)
    ->name('robots')
    ->withoutMiddleware([
        TrackVisit::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
    ]);

Route::get('/sitemap.xml', SitemapController::class)
    ->name('sitemap')
    ->withoutMiddleware([
        TrackVisit::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
    ]);

Route::inertia('/', 'marketing/home')->name('home');
Route::inertia('/a-propos', 'marketing/about')->name('about');
Route::redirect('/pourquoi-nous', '/a-propos', 301);
Route::redirect('/site-wordpress', '/', 301);
Route::redirect('/creation-site', '/', 301);
Route::redirect('/integrateur-solutions', '/', 301);
Route::redirect('/woocommerce', '/', 301);
Route::redirect('/application-web', '/', 301);
Route::redirect('/seo', '/', 301);
Route::redirect('/realisations', '/', 301);
Route::redirect('/realisations/{slug}', '/', 301)->where('slug', '[a-z0-9\-]+');
Route::get('/actualites', [MarketingArticleController::class, 'index'])->name('actualites.index');
Route::get('/actualites/{article:slug}', [MarketingArticleController::class, 'show'])->name('actualites.show');
Route::get('/conseils-securite', [MarketingSecurityTipController::class, 'index'])->name('conseils-securite.index');
Route::get('/conseils-securite/{securityTip:slug}', [MarketingSecurityTipController::class, 'show'])->name('conseils-securite.show');
Route::inertia('/contact', 'marketing/contact')->name('contact');
Route::inertia('/politique-de-confidentialite', 'marketing/privacy')->name('privacy');
Route::inertia('/mentions-legales', 'marketing/legal')->name('legal');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/analytics/duration', [AnalyticsController::class, 'updateDuration'])->name('analytics.duration');
Route::get('/analytics/duration', fn () => redirect()->route('analytics.index'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('admin')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::resource('articles', AdminArticleController::class)->except(['show']);
        Route::resource('conseils', AdminSecurityTipController::class)->except(['show']);
        Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    });
});

require __DIR__.'/settings.php';
