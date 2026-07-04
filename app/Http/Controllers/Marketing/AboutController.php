<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\GalleryVideo;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(): Response
    {
        $featuredVideo = GalleryVideo::query()
            ->published()
            ->ordered()
            ->get()
            ->first(fn (GalleryVideo $video): bool => $video->youtube_id === 'D_Wo8Y_tV9E')
            ?? GalleryVideo::query()
                ->published()
                ->where('youtube_url', 'like', '%D_Wo8Y_tV9E%')
                ->first();

        return Inertia::render('marketing/about', [
            'featuredVideo' => $featuredVideo?->toPublicArray(),
        ]);
    }
}
