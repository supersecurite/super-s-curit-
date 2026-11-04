<?php

namespace Database\Factories;

use App\Models\JobOffer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobOffer>
 */
class JobOfferFactory extends Factory
{
    protected $model = JobOffer::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->randomElement([
            'Agent de sécurité',
            'Superviseur de site',
            'Responsable sécurité',
            'Technicien vidéosurveillance',
        ]);

        return [
            'title' => $title,
            'location' => fake()->randomElement(['Conakry', 'Boké', 'Kindia', 'Kankan']),
            'contract_type' => 'Temps plein',
            'description' => fake()->paragraph(),
            'is_active' => true,
            'published_at' => now(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'is_active' => false,
        ]);
    }
}
