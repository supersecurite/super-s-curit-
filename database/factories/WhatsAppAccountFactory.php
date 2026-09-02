<?php

namespace Database\Factories;

use App\Enums\WhatsAppAccountDriver;
use App\Models\WhatsAppAccount;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<WhatsAppAccount>
 */
class WhatsAppAccountFactory extends Factory
{
    protected $model = WhatsAppAccount::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Compte '.fake()->company(),
            'phone_number_id' => fake()->numerify('##############'),
            'business_account_id' => fake()->numerify('##############'),
            'access_token' => 'test-token-'.Str::random(24),
            'app_secret' => 'test-secret-'.Str::random(16),
            'verify_token' => 'verify-'.Str::random(12),
            'driver' => WhatsAppAccountDriver::Log,
            'is_active' => true,
            'is_default' => false,
        ];
    }

    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
            'is_active' => true,
        ]);
    }

    public function meta(): static
    {
        return $this->state(fn (array $attributes) => [
            'driver' => WhatsAppAccountDriver::Meta,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'is_default' => false,
        ]);
    }
}
