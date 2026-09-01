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

    public function configure(): static
    {
        return $this->afterMaking(function (MarketingContact $contact): void {
            if (! $contact->is_company) {
                $contact->company_name = null;
                $contact->company_role = null;
                $contact->company_contacts = null;
            }
        });
    }

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
            'is_company' => fake()->boolean(60),
            'company_name' => fake()->optional()->company(),
            'company_role' => fake()->optional()->jobTitle(),
            'company_contacts' => fake()->optional(0.7)->passthrough([
                [
                    'type' => 'email',
                    'value' => fake()->companyEmail(),
                    'label' => 'Compta',
                ],
                [
                    'type' => 'whatsapp',
                    'value' => '+224'.fake()->numerify('6########'),
                    'label' => null,
                ],
            ]),
            'address' => fake()->optional()->address(),
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
