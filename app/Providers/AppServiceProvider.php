<?php

namespace App\Providers;

use App\Seo\SeoPageRegistry;
use App\Seo\StructuredDataBuilder;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureSeoViews();
        $this->configureFrontendAssets();
    }

    protected function configureFrontendAssets(): void
    {
        Vite::prefetch(concurrency: 2, event: 'click');
    }

    protected function configureSeoViews(): void
    {
        View::composer('app', function ($view): void {
            $request = request();

            foreach (config('seo.robots_disallow', []) as $blockedPath) {
                if (str_starts_with('/'.$request->path(), rtrim($blockedPath, '/'))) {
                    return;
                }
            }

            $registry = app(SeoPageRegistry::class);

            $view->with('pageMeta', $registry->resolve($request));
            $view->with('structuredData', app(StructuredDataBuilder::class)->build($request));
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
