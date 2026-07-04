<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Support\YoutubeUrl;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(): Response
    {
        $featuredVideo = YoutubeUrl::toPublicArray(
            youtubeUrl: (string) config('super-securite.about_youtube_url'),
            title: 'Super Sécurité en action',
            description: 'Découvrez notre équipe et notre engagement sur le terrain à Conakry et en région.',
        );

        return Inertia::render('marketing/about', [
            'featuredVideo' => $featuredVideo,
        ]);
    }
}
