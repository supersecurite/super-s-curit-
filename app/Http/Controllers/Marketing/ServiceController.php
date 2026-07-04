<?php

namespace App\Http\Controllers\Marketing;

use App\Enums\ServiceId;
use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\GalleryVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function show(Request $request): Response
    {
        $serviceId = basename($request->path());

        abort_unless(in_array($serviceId, ServiceId::values(), true), 404);

        $galleryImages = GalleryImage::query()
            ->published()
            ->forService($serviceId)
            ->ordered()
            ->limit(12)
            ->get()
            ->map(fn (GalleryImage $image) => $image->toPublicArray())
            ->values()
            ->all();

        $galleryVideos = GalleryVideo::query()
            ->published()
            ->forService($serviceId)
            ->ordered()
            ->get()
            ->concat(
                GalleryVideo::query()
                    ->published()
                    ->general()
                    ->ordered()
                    ->get(),
            )
            ->take(3)
            ->map(fn (GalleryVideo $video) => $video->toPublicArray())
            ->values()
            ->all();

        return Inertia::render('marketing/service-page', [
            'serviceId' => $serviceId,
            'galleryImages' => $galleryImages,
            'galleryVideos' => $galleryVideos,
        ]);
    }
}
