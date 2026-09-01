<?php

namespace Database\Factories;

use App\Models\MarketingList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingList>
 */
class MarketingListFactory extends Factory
{
    protected $model = MarketingList::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
