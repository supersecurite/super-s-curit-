<?php

namespace App\Support;

use App\Http\Controllers\ContactController;
use App\Http\Controllers\Marketing\AboutController as MarketingAboutController;
use App\Http\Controllers\Marketing\ArticleController as MarketingArticleController;
use App\Http\Controllers\Marketing\GalleryController as MarketingGalleryController;
use App\Http\Controllers\Marketing\SecurityAgentApplicationController as MarketingSecurityAgentApplicationController;
use App\Http\Controllers\Marketing\SecurityTipController as MarketingSecurityTipController;
use App\Http\Controllers\Marketing\ServiceController;
use App\Models\Partner;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Enregistre les routes du site public marketing pour une locale.
 */
final class RegisterMarketingPublicRoutes
{
    public static function handle(string $locale): void
    {
        $prefix = LocaleUrl::prefixFor($locale);
        $namePrefix = $locale === LocaleUrl::defaultLocale() ? '' : $locale.'.';

        $register = function () use ($locale, $namePrefix): void {
            Route::get('/', function () {
                $partners = Partner::query()
                    ->published()
                    ->ordered()
                    ->get()
                    ->map(fn (Partner $partner) => $partner->toPublicArray())
                    ->all();

                return Inertia::render('marketing/home', [
                    'partners' => $partners,
                ]);
            })->name($namePrefix.'home');

            Route::get('/entreprise', [ServiceController::class, 'show'])->name($namePrefix.'services.entreprise');
            Route::get('/residence', [ServiceController::class, 'show'])->name($namePrefix.'services.residence');
            Route::get('/chantiers', [ServiceController::class, 'show'])->name($namePrefix.'services.chantiers');
            Route::get('/zones-minieres', [ServiceController::class, 'show'])->name($namePrefix.'services.zones-minieres');
            Route::get('/galerie', [MarketingGalleryController::class, 'index'])->name($namePrefix.'galerie.index');
            Route::get('/a-propos', MarketingAboutController::class)->name($namePrefix.'about');
            Route::redirect('/pourquoi-nous', LocaleUrl::localizePath('/a-propos', $locale), 301);
            Route::get('/actualites', [MarketingArticleController::class, 'index'])->name($namePrefix.'actualites.index');
            Route::get('/actualites/{article:slug}', [MarketingArticleController::class, 'show'])->name($namePrefix.'actualites.show');
            Route::get('/conseils-securite', [MarketingSecurityTipController::class, 'index'])->name($namePrefix.'conseils-securite.index');
            Route::get('/conseils-securite/{securityTip:slug}', [MarketingSecurityTipController::class, 'show'])->name($namePrefix.'conseils-securite.show');
            Route::get('/devenir-agent', [MarketingSecurityAgentApplicationController::class, 'create'])->name($namePrefix.'devenir-agent.index');
            Route::post('/devenir-agent', [MarketingSecurityAgentApplicationController::class, 'store'])
                ->middleware('throttle:5,1')
                ->name($namePrefix.'devenir-agent.store');
            Route::get('/devenir-agent/merci', [MarketingSecurityAgentApplicationController::class, 'thankYou'])->name($namePrefix.'devenir-agent.merci');
            Route::inertia('/contact', 'marketing/contact')->name($namePrefix.'contact');
            Route::inertia('/politique-de-confidentialite', 'marketing/privacy')->name($namePrefix.'privacy');
            Route::inertia('/mentions-legales', 'marketing/legal')->name($namePrefix.'legal');
            Route::post('/contact', [ContactController::class, 'store'])->name($namePrefix.'contact.store');
        };

        if ($prefix === '') {
            $register();

            return;
        }

        Route::prefix($prefix)->group($register);
    }
}
