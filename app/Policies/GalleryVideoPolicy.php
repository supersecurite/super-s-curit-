<?php

namespace App\Policies;

use App\Models\GalleryVideo;
use App\Models\User;

class GalleryVideoPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, GalleryVideo $galleryVideo): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, GalleryVideo $galleryVideo): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, GalleryVideo $galleryVideo): bool
    {
        return $user->isAdmin();
    }
}
