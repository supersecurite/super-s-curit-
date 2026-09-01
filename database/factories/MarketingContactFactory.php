<?php

namespace Database\Factories;

use App\Models\MarketingContact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingContact>
 */
class MarketingContactFactory extends Factory
{
    protected $model = MarketingContact::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+224'.fake()->numerify('6########'),
            'tags' => fake()->optional()->randomElements(['prospect', 'client', 'vip'], fake()->numberBetween(1, 2)),
            'marketing_consent' => fake()->boolean(80),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function withoutEmail(): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => null,
        ]);
    }

    public function withoutPhone(): static
    {
        return $this->state(fn (array $attributes) => [
            'phone' => null,
        ]);
    }
}
