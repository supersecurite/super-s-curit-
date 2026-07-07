<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\GalleryImage;
use App\Models\User;

class GalleryImagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('gallery_images');
    }

    public function view(User $user, GalleryImage $galleryImage): bool
    {
        return $user->canAccessFeature('gallery_images');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::GalleryImagesCreate);
    }

    public function update(User $user, GalleryImage $galleryImage): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::GalleryImagesUpdate);
    }

    public function delete(User $user, GalleryImage $galleryImage): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::GalleryImagesDelete);
    }
}
