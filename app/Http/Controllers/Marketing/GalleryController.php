<?php

namespace App\Http\Controllers\Marketing;

use App\Enums\ServiceId;
use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\GalleryVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $serviceFilter = $request->string('service')->toString();
        $validServices = ServiceId::values();

        $query = GalleryImage::query()
            ->published()
            ->ordered();

        if ($serviceFilter === 'general') {
            $query->general();
        } elseif ($serviceFilter !== '' && $serviceFilter !== 'all' && in_array($serviceFilter, $validServices, true)) {
            $query->forService($serviceFilter);
        }

        $images = $query
            ->get()
            ->map(fn (GalleryImage $image) => $image->toPublicArray())
            ->values()
            ->all();

        $videoQuery = GalleryVideo::query()
            ->published()
            ->ordered();

        if ($serviceFilter === 'general') {
            $videoQuery->general();
        } elseif ($serviceFilter !== '' && $serviceFilter !== 'all' && in_array($serviceFilter, $validServices, true)) {
            $videoQuery->forService($serviceFilter);
        }

        $videos = $videoQuery
            ->get()
            ->map(fn (GalleryVideo $video) => $video->toPublicArray())
            ->values()
            ->all();

        $countsByService = GalleryImage::query()
            ->published()
            ->whereNotNull('service_id')
            ->selectRaw('service_id, count(*) as total')
            ->groupBy('service_id')
            ->pluck('total', 'service_id')
            ->all();

        $countsByService['general'] = GalleryImage::query()
            ->published()
            ->general()
            ->count();

        $countsVideosByService = GalleryVideo::query()
            ->published()
            ->whereNotNull('service_id')
            ->selectRaw('service_id, count(*) as total')
            ->groupBy('service_id')
            ->pluck('total', 'service_id')
            ->all();

        $countsVideosByService['general'] = GalleryVideo::query()
            ->published()
            ->general()
            ->count();

        $resolvedFilter = match (true) {
            $serviceFilter === 'general' => 'general',
            in_array($serviceFilter, $validServices, true) => $serviceFilter,
            default => 'all',
        };

        return Inertia::render('marketing/gallery/index', [
            'images' => $images,
            'videos' => $videos,
            'services' => ServiceId::options(),
            'countsByService' => $countsByService,
            'countsVideosByService' => $countsVideosByService,
            'filters' => [
                'service' => $resolvedFilter,
            ],
        ]);
    }
}
