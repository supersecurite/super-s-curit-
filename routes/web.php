<?php

use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\GalleryImageController as AdminGalleryImageController;
use App\Http\Controllers\Admin\SecurityAgentApplicationController as AdminSecurityAgentApplicationController;
use App\Http\Controllers\Admin\SecurityTipController as AdminSecurityTipController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Marketing\ArticleController as MarketingArticleController;
use App\Http\Controllers\Marketing\GalleryController as MarketingGalleryController;
use App\Http\Controllers\Marketing\SecurityAgentApplicationController as MarketingSecurityAgentApplicationController;
use App\Http\Controllers\Marketing\SecurityTipController as MarketingSecurityTipController;
use App\Http\Controllers\Marketing\ServiceController;
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
Route::get('/entreprise', [ServiceController::class, 'show'])->name('services.entreprise');
Route::get('/residence', [ServiceController::class, 'show'])->name('services.residence');
Route::get('/chantiers', [ServiceController::class, 'show'])->name('services.chantiers');
Route::get('/zones-minieres', [ServiceController::class, 'show'])->name('services.zones-minieres');
Route::get('/galerie', [MarketingGalleryController::class, 'index'])->name('galerie.index');
Route::inertia('/a-propos', 'marketing/about')->name('about');
Route::redirect('/pourquoi-nous', '/a-propos', 301);
Route::get('/actualites', [MarketingArticleController::class, 'index'])->name('actualites.index');
Route::get('/actualites/{article:slug}', [MarketingArticleController::class, 'show'])->name('actualites.show');
Route::get('/conseils-securite', [MarketingSecurityTipController::class, 'index'])->name('conseils-securite.index');
Route::get('/conseils-securite/{securityTip:slug}', [MarketingSecurityTipController::class, 'show'])->name('conseils-securite.show');
Route::get('/devenir-agent', [MarketingSecurityAgentApplicationController::class, 'create'])->name('devenir-agent.index');
Route::post('/devenir-agent', [MarketingSecurityAgentApplicationController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('devenir-agent.store');
Route::get('/devenir-agent/merci', [MarketingSecurityAgentApplicationController::class, 'thankYou'])->name('devenir-agent.merci');
Route::inertia('/contact', 'marketing/contact')->name('contact');
Route::inertia('/politique-de-confidentialite', 'marketing/privacy')->name('privacy');
Route::inertia('/mentions-legales', 'marketing/legal')->name('legal');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/analytics/duration', [AnalyticsController::class, 'updateDuration'])->name('analytics.duration');
Route::get('/analytics/duration', fn () => redirect()->route('analytics.index'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('gallery-images', AdminGalleryImageController::class);

    Route::resource('articles', AdminArticleController::class)
        ->parameters(['articles' => 'article:slug']);

    Route::resource('conseils', AdminSecurityTipController::class)
        ->parameters(['conseils' => 'conseil:slug']);

    Route::middleware('admin')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::resource('candidatures-agents', AdminSecurityAgentApplicationController::class)->only(['index', 'show', 'update']);
        Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    });
});

require __DIR__.'/settings.php';
