<?php

namespace Database\Factories;

use App\Enums\SecurityAgentApplicationStatus;
use App\Enums\SecurityAgentPost;
use App\Models\SecurityAgentApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SecurityAgentApplication>
 */
class SecurityAgentApplicationFactory extends Factory
{
    protected $model = SecurityAgentApplication::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'phone' => '+224'.fake()->numerify('6########'),
            'email' => fake()->optional()->safeEmail(),
            'experience_years' => fake()->numberBetween(0, 15),
            'availability' => fake()->randomElement(['jour', 'nuit', '24h', 'evenementiel']),
            'certifications' => fake()->optional()->sentence(),
            'motivation' => fake()->optional()->paragraph(),
            'post' => fake()->randomElement(SecurityAgentPost::cases()),
            'region_id' => '1',
            'region_name' => 'Région de Conakry',
            'prefecture_id' => '10',
            'prefecture_name' => 'Conakry',
            'commune_id' => '104',
            'commune_name' => 'LAMBANYI',
            'quartier_id' => null,
            'quartier_name' => null,
            'address_detail' => fake()->optional()->streetAddress(),
            'status' => SecurityAgentApplicationStatus::Pending,
        ];
    }

    public function contacted(): static
    {
        return $this->state(fn (): array => [
            'status' => SecurityAgentApplicationStatus::Contacted,
            'contacted_at' => now()->subDay(),
            'reviewed_by_id' => User::factory()->admin(),
        ]);
    }

    public function recruited(): static
    {
        return $this->state(fn (): array => [
            'status' => SecurityAgentApplicationStatus::Recruited,
            'contacted_at' => now()->subDays(2),
            'reviewed_by_id' => User::factory()->admin(),
        ]);
    }
}
