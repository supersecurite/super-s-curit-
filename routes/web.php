<?php

use App\Http\Controllers\Admin\AccessLogController;
use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\GalleryImageController as AdminGalleryImageController;
use App\Http\Controllers\Admin\GalleryVideoController as AdminGalleryVideoController;
use App\Http\Controllers\Admin\MarketingCampaignController as AdminMarketingCampaignController;
use App\Http\Controllers\Admin\MarketingContactController as AdminMarketingContactController;
use App\Http\Controllers\Admin\MarketingEmailAccountController as AdminMarketingEmailAccountController;
use App\Http\Controllers\Admin\MarketingListController as AdminMarketingListController;
use App\Http\Controllers\Admin\MarketingMessageTemplateController as AdminMarketingMessageTemplateController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Admin\SecurityAgentApplicationController as AdminSecurityAgentApplicationController;
use App\Http\Controllers\Admin\SecurityTipController as AdminSecurityTipController;
use App\Http\Controllers\Admin\WhatsAppAccountController as AdminWhatsAppAccountController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Marketing\AboutController as MarketingAboutController;
use App\Http\Controllers\Marketing\ArticleController as MarketingArticleController;
use App\Http\Controllers\Marketing\GalleryController as MarketingGalleryController;
use App\Http\Controllers\Marketing\SecurityAgentApplicationController as MarketingSecurityAgentApplicationController;
use App\Http\Controllers\Marketing\SecurityTipController as MarketingSecurityTipController;
use App\Http\Controllers\Marketing\ServiceController;
use App\Http\Controllers\MarketingCampaignOpenController;
use App\Http\Controllers\MarketingWhatsAppWebhookController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\TrackVisit;
use App\Models\Partner;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('c/o/{openToken}', [MarketingCampaignOpenController::class, 'track'])
    ->name('marketing-campaigns.open')
    ->withoutMiddleware([
        TrackVisit::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
    ]);

Route::match(['get', 'post'], 'webhooks/marketing/whatsapp/{whatsapp_account}', MarketingWhatsAppWebhookController::class)
    ->name('webhooks.marketing.whatsapp')
    ->withoutMiddleware([
        TrackVisit::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
    ]);

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
})->name('home');
Route::get('/entreprise', [ServiceController::class, 'show'])->name('services.entreprise');
Route::get('/residence', [ServiceController::class, 'show'])->name('services.residence');
Route::get('/chantiers', [ServiceController::class, 'show'])->name('services.chantiers');
Route::get('/zones-minieres', [ServiceController::class, 'show'])->name('services.zones-minieres');
Route::get('/galerie', [MarketingGalleryController::class, 'index'])->name('galerie.index');
Route::get('/a-propos', MarketingAboutController::class)->name('about');
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
    Route::get('dashboard', DashboardController::class)
        ->middleware('backoffice.permission:dashboard')
        ->name('dashboard');

    Route::middleware('backoffice.permission:gallery_images')->group(function () {
        Route::resource('gallery-images', AdminGalleryImageController::class);
    });

    Route::middleware('backoffice.permission:gallery_videos')->group(function () {
        Route::resource('gallery-videos', AdminGalleryVideoController::class);
    });

    Route::middleware('backoffice.permission:articles')->group(function () {
        Route::resource('articles', AdminArticleController::class)
            ->parameters(['articles' => 'article:slug']);
    });

    Route::middleware('backoffice.permission:conseils')->group(function () {
        Route::resource('conseils', AdminSecurityTipController::class)
            ->parameters(['conseils' => 'conseil:slug']);
    });

    Route::middleware('backoffice.permission:users')->group(function () {
        Route::post('users/{user}/send-welcome', [UserController::class, 'sendWelcome'])
            ->name('users.send-welcome');
        Route::post('users/{user}/send-password-reset', [UserController::class, 'sendPasswordReset'])
            ->name('users.send-password-reset');
        Route::resource('users', UserController::class)->except(['show']);
    });

    Route::middleware('backoffice.permission:agent_applications')->group(function () {
        Route::resource('candidatures-agents', AdminSecurityAgentApplicationController::class)->only(['index', 'show', 'update']);
    });

    Route::middleware('backoffice.permission:partners')->group(function () {
        Route::resource('partners', AdminPartnerController::class);
    });

    Route::middleware('backoffice.permission:marketing_campaigns')->group(function () {
        Route::resource('marketing-email-accounts', AdminMarketingEmailAccountController::class)
            ->parameters(['marketing-email-accounts' => 'marketing_email_account'])
            ->except(['show']);
        Route::resource('marketing-whatsapp-accounts', AdminWhatsAppAccountController::class)
            ->parameters(['marketing-whatsapp-accounts' => 'whatsapp_account'])
            ->except(['show']);
        Route::resource('marketing-templates', AdminMarketingMessageTemplateController::class);
        Route::post('marketing-campaigns/{marketing_campaign}/launch', [AdminMarketingCampaignController::class, 'launch'])
            ->name('marketing-campaigns.launch');
        Route::get('marketing-campaigns/audience-preview', [AdminMarketingCampaignController::class, 'audiencePreview'])
            ->name('marketing-campaigns.audience-preview');
        Route::get('marketing-campaigns/list-audience/{marketing_list}', [AdminMarketingCampaignController::class, 'listAudience'])
            ->name('marketing-campaigns.list-audience');
        Route::resource('marketing-campaigns', AdminMarketingCampaignController::class);
    });

    Route::middleware('backoffice.permission:marketing_clients')->group(function () {
        Route::get('marketing-clients/import', [AdminMarketingContactController::class, 'importForm'])
            ->name('marketing-clients.import');
        Route::get('marketing-clients/import/modele', [AdminMarketingContactController::class, 'downloadImportTemplate'])
            ->name('marketing-clients.import.template');
        Route::post('marketing-clients/import', [AdminMarketingContactController::class, 'import'])
            ->name('marketing-clients.import.store');
        Route::resource('marketing-clients', AdminMarketingContactController::class);
        Route::resource('marketing-lists', AdminMarketingListController::class);
        Route::post('marketing-lists/{marketing_list}/contacts', [AdminMarketingListController::class, 'attachContact'])
            ->name('marketing-lists.contacts.attach');
        Route::delete('marketing-lists/{marketing_list}/contacts/{marketing_client}', [AdminMarketingListController::class, 'detachContact'])
            ->name('marketing-lists.contacts.detach');
    });

    Route::middleware('backoffice.permission:analytics')->group(function () {
        Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    });

    Route::middleware('backoffice.permission:access_logs')->group(function () {
        Route::get('access-logs/feed', [AccessLogController::class, 'feed'])->name('access-logs.feed');
        Route::get('access-logs', [AccessLogController::class, 'index'])->name('access-logs.index');
    });
});

require __DIR__.'/settings.php';
