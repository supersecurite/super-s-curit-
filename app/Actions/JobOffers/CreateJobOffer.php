<?php

namespace App\Actions\JobOffers;

use App\Actions\Action;
use App\Models\JobOffer;

/**
 * Crée une offre d'emploi Carrières.
 *
 * @param  array{title: string, location: string, contract_type: string, description?: ?string, is_active?: bool}  $data
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
            'slug' => JobOffer::generateUniqueSlug($data['title']),
            'location' => $data['location'],
            'contract_type' => $data['contract_type'],
            'description' => $data['description'] ?? null,
            'is_active' => $isActive,
            'published_at' => $isActive ? now() : null,
        ]);
    }
}
