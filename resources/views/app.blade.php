<!DOCTYPE html>
<html lang="{{ config('seo.language', 'fr') }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#ff001b">
        <meta name="color-scheme" content="light">

        @fonts

        @isset($structuredData)
            <script type="application/ld+json">{!! json_encode($structuredData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) !!}</script>
        @endisset

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            @isset($pageMeta)
                <title data-inertia head-key="title">{{ $pageMeta['title'] }}</title>
                <meta
                    data-inertia
                    head-key="description"
                    name="description"
                    content="{{ $pageMeta['description'] }}"
                />
                <link data-inertia head-key="canonical" rel="canonical" href="{{ $pageMeta['canonical'] }}" />
                <meta data-inertia head-key="robots" name="robots" content="{{ $pageMeta['robots'] }}" />
                <meta data-inertia head-key="author" name="author" content="{{ config('seo.organization.founder') }}" />
                <meta data-inertia head-key="og:type" property="og:type" content="{{ $pageMeta['og_type'] }}" />
                <meta data-inertia head-key="og:locale" property="og:locale" content="{{ config('seo.locale') }}" />
                <meta data-inertia head-key="og:site_name" property="og:site_name" content="{{ config('seo.site_name') }}" />
                <meta data-inertia head-key="og:title" property="og:title" content="{{ $pageMeta['title'] }}" />
                <meta data-inertia head-key="og:description" property="og:description" content="{{ $pageMeta['description'] }}" />
                <meta data-inertia head-key="og:url" property="og:url" content="{{ $pageMeta['canonical'] }}" />
                <meta data-inertia head-key="og:image" property="og:image" content="{{ $pageMeta['og_image'] }}" />
                <meta data-inertia head-key="og:image:width" property="og:image:width" content="{{ config('seo.og_image.width') }}" />
                <meta data-inertia head-key="og:image:height" property="og:image:height" content="{{ config('seo.og_image.height') }}" />
                <meta data-inertia head-key="og:image:type" property="og:image:type" content="{{ $pageMeta['og_image_type'] }}" />
                <meta data-inertia head-key="og:image:alt" property="og:image:alt" content="{{ $pageMeta['og_image_alt'] }}" />
                <meta data-inertia head-key="twitter:card" name="twitter:card" content="summary_large_image" />
                <meta data-inertia head-key="twitter:title" name="twitter:title" content="{{ $pageMeta['title'] }}" />
                <meta data-inertia head-key="twitter:description" name="twitter:description" content="{{ $pageMeta['description'] }}" />
                <meta data-inertia head-key="twitter:image" name="twitter:image" content="{{ $pageMeta['og_image'] }}" />
                @if (config('seo.twitter_site'))
                    <meta data-inertia head-key="twitter:site" name="twitter:site" content="{{ config('seo.twitter_site') }}" />
                @endif
            @else
                <title data-inertia>{{ config('seo.site_name', config('app.name')) }}</title>
            @endisset
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
