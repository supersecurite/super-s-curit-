<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\GalleryVideo;
use App\Models\User;

class GalleryVideoPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('gallery_videos');
    }

    public function view(User $user, GalleryVideo $galleryVideo): bool
    {
        return $user->canAccessFeature('gallery_videos');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::GalleryVideosCreate);
    }

    public function update(User $user, GalleryVideo $galleryVideo): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::GalleryVideosUpdate);
    }

    public function delete(User $user, GalleryVideo $galleryVideo): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::GalleryVideosDelete);
    }
}
