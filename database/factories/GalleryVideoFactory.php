<?php

namespace Database\Factories;

use App\Enums\ServiceId;
use App\Models\GalleryVideo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GalleryVideo>
 */
class GalleryVideoFactory extends Factory
{
    protected $model = GalleryVideo::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_id' => ServiceId::Entreprise,
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->sentence(12),
            'sort_order' => 0,
            'is_published' => true,
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn (): array => [
            'is_published' => false,
        ]);
    }

    public function general(): static
    {
        return $this->state(fn (): array => [
            'service_id' => null,
        ]);
    }
}
