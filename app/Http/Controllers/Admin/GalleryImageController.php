<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ServiceId;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGalleryImageRequest;
use App\Http\Requests\UpdateGalleryImageRequest;
use App\Models\GalleryImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryImageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', GalleryImage::class);

        $query = GalleryImage::query();

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
                    ->where('alt', 'like', '%'.$search.'%')
                    ->orWhere('caption', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('status') && $request->string('status')->toString() !== 'all') {
            $query->where('is_published', $request->string('status')->toString() === 'published');
        }

        $galleryImages = $query
            ->ordered()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (GalleryImage $image) => [
                ...$image->toAdminArray(),
                'can_update' => $request->user()?->can('update', $image) ?? false,
                'can_delete' => $request->user()?->can('delete', $image) ?? false,
            ]);

        return Inertia::render('gallery-images/index', [
            'galleryImages' => $galleryImages,
            'services' => ServiceId::options(),
            'filters' => $request->only(['search', 'service', 'status']),
            'canCreate' => $request->user()?->can('create', GalleryImage::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', GalleryImage::class);

        return Inertia::render('gallery-images/create', [
            'services' => ServiceId::options(),
        ]);
    }

    public function store(StoreGalleryImageRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['image'] = $request->file('image')->store('gallery/images', 'public');
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_published'] = $request->boolean('is_published', true);

        GalleryImage::query()->create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => bt('toasts.gallery_image_created'),
        ]);

        return to_route('gallery-images.index');
    }

    public function show(GalleryImage $galleryImage): RedirectResponse
    {
        $this->authorize('view', $galleryImage);

        return redirect()->route('gallery-images.edit', $galleryImage);
    }

    public function edit(GalleryImage $galleryImage): Response
    {
        $this->authorize('update', $galleryImage);

        return Inertia::render('gallery-images/edit', [
            'galleryImage' => $galleryImage->toAdminArray(),
            'services' => ServiceId::options(),
        ]);
    }

    public function update(UpdateGalleryImageRequest $request, GalleryImage $galleryImage): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($galleryImage->image !== null && ! str_starts_with($galleryImage->image, '/')) {
                Storage::disk('public')->delete($galleryImage->image);
            }

            $validated['image'] = $request->file('image')->store('gallery/images', 'public');
        } else {
            unset($validated['image']);
        }

        $validated['is_published'] = $request->boolean('is_published');

        $galleryImage->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => bt('toasts.gallery_image_updated'),
        ]);

        return to_route('gallery-images.index');
    }

    public function destroy(GalleryImage $galleryImage): RedirectResponse
    {
        $this->authorize('delete', $galleryImage);

        if ($galleryImage->image !== null && ! str_starts_with($galleryImage->image, '/')) {
            Storage::disk('public')->delete($galleryImage->image);
        }

        $galleryImage->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => bt('toasts.gallery_image_deleted'),
        ]);

        return to_route('gallery-images.index');
    }
}
