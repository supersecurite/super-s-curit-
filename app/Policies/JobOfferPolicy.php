<?php

namespace App\Policies;

use App\Enums\BackofficePermission;
use App\Models\JobOffer;
use App\Models\User;

class JobOfferPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessFeature('job_offers');
    }

    public function view(User $user, JobOffer $jobOffer): bool
    {
        return $user->canAccessFeature('job_offers');
    }

    public function create(User $user): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::JobOffersCreate);
    }

    public function update(User $user, JobOffer $jobOffer): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::JobOffersUpdate);
    }

    public function delete(User $user, JobOffer $jobOffer): bool
    {
        return $user->hasBackofficePermission(BackofficePermission::JobOffersDelete);
    }
}
