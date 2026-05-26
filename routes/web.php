<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/robots.txt', RobotsController::class)->name('robots');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::inertia('/', 'marketing/home')->name('home');
Route::inertia('/a-propos', 'marketing/about')->name('about');
Route::inertia('/contact', 'marketing/contact')->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/analytics/duration', [AnalyticsController::class, 'updateDuration'])->name('analytics.duration');
Route::get('/analytics/duration', fn () => redirect()->route('analytics.index'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('admin')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    });
});

require __DIR__.'/settings.php';
