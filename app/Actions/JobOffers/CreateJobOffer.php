<?php

namespace App\Actions\JobOffers;

use App\Actions\Action;
use App\Models\JobOffer;

/**
 * Crée une offre d'emploi Carrières.
 *
 * @param  array<string, mixed>  $data
 */
class CreateJobOffer extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): JobOffer
    {
        $isActive = (bool) ($data['is_active'] ?? true);

        return JobOffer::query()->create([
            'title' => $data['title'],
            'title_en' => $data['title_en'] ?? null,
            'title_zh' => $data['title_zh'] ?? null,
            'slug' => JobOffer::generateUniqueSlug($data['title']),
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
            'published_at' => $isActive ? now() : null,
        ]);
    }
}
