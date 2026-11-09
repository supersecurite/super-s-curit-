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
            'title_en' => $data['title_en'] ?? null,
            'title_zh' => $data['title_zh'] ?? null,
            'location' => $data['location'],
            'location_en' => $data['location_en'] ?? null,
            'location_zh' => $data['location_zh'] ?? null,
            'contract_type' => $data['contract_type'],
            'contract_type_en' => $data['contract_type_en'] ?? null,
            'contract_type_zh' => $data['contract_type_zh'] ?? null,
            'description' => $data['description'] ?? null,
            'description_en' => $data['description_en'] ?? null,
            'description_zh' => $data['description_zh'] ?? null,
            'is_active' => $isActive,
        ]);

        if ($offer->isDirty('title')) {
            $offer->slug = JobOffer::generateUniqueSlug($title, $offer->id);
        }

        if ($isActive && $offer->published_at === null) {
            $offer->published_at = now();
        }

        $offer->save();

        return $offer->refresh();
    }
}
