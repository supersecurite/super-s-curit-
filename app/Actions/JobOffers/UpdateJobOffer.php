<?php

namespace App\Actions\JobOffers;

use App\Actions\Action;
use App\Models\JobOffer;

/**
 * Met à jour une offre d'emploi (hors toggle dédié).
 */
class UpdateJobOffer extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(JobOffer $offer, array $data): JobOffer
    {
        $title = $data['title'];
        $isActive = (bool) ($data['is_active'] ?? $offer->is_active);

        $offer->fill([
            'title' => $title,
            'location' => $data['location'],
            'contract_type' => $data['contract_type'],
            'description' => $data['description'] ?? null,
            'is_active' => $isActive,
        ]);

        if ($offer->isDirty('title')) {
            $offer->slug = JobOffer::generateUniqueSlug($title, $offer->id);
        }

        if ($isActive && $offer->published_at === null) {
            $offer->published_at = now();
        }

        if (! $isActive) {
            // Garde published_at pour l'historique ; seul is_active contrôle la visibilité.
        }

        $offer->save();

        return $offer->refresh();
    }
}
