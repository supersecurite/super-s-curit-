<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ServiceId;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGalleryVideoRequest;
use App\Http\Requests\UpdateGalleryVideoRequest;
use App\Models\GalleryVideo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryVideoController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', GalleryVideo::class);

        $query = GalleryVideo::query();

        if ($request->filled('service') && $request->string('service')->toString() !== 'all') {
            $service = $request->string('service')->toString();

            if ($service === 'general') {
                $query->general();
            } else {
                $query->forService($service);
            }
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('title', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('status') && $request->string('status')->toString() !== 'all') {
            $query->where('is_published', $request->string('status')->toString() === 'published');
        }

        $galleryVideos = $query
            ->ordered()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (GalleryVideo $video) => [
                ...$video->toAdminArray(),
                'can_update' => $request->user()?->can('update', $video) ?? false,
                'can_delete' => $request->user()?->can('delete', $video) ?? false,
            ]);

        return Inertia::render('gallery-videos/index', [
            'galleryVideos' => $galleryVideos,
            'services' => ServiceId::options(),
            'filters' => $request->only(['search', 'service', 'status']),
            'canCreate' => $request->user()?->can('create', GalleryVideo::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', GalleryVideo::class);

        return Inertia::render('gallery-videos/create', [
            'services' => ServiceId::options(),
        ]);
    }

    public function store(StoreGalleryVideoRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_published'] = $request->boolean('is_published', true);

        GalleryVideo::query()->create($validated);

        return redirect()
            ->route('gallery-videos.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Vidéo ajoutée à la galerie.',
            ]);
    }

    public function show(GalleryVideo $galleryVideo): RedirectResponse
    {
        $this->authorize('view', $galleryVideo);

        return redirect()->route('gallery-videos.edit', $galleryVideo);
    }

    public function edit(GalleryVideo $galleryVideo): Response
    {
        $this->authorize('update', $galleryVideo);

        return Inertia::render('gallery-videos/edit', [
            'galleryVideo' => $galleryVideo->toAdminArray(),
            'services' => ServiceId::options(),
        ]);
    }

    public function update(UpdateGalleryVideoRequest $request, GalleryVideo $galleryVideo): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_published'] = $request->boolean('is_published');

        $galleryVideo->update($validated);

        return redirect()
            ->route('gallery-videos.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Vidéo de galerie mise à jour.',
            ]);
    }

    public function destroy(GalleryVideo $galleryVideo): RedirectResponse
    {
        $this->authorize('delete', $galleryVideo);

        $galleryVideo->delete();

        return redirect()
            ->route('gallery-videos.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Vidéo supprimée de la galerie.',
            ]);
    }
}
