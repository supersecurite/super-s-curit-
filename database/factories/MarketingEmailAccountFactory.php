<?php

namespace Database\Factories;

use App\Enums\MarketingEmailAccountDriver;
use App\Models\MarketingEmailAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingEmailAccount>
 */
class MarketingEmailAccountFactory extends Factory
{
    protected $model = MarketingEmailAccount::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company().' — e-mail',
            'from_address' => fake()->unique()->safeEmail(),
            'from_name' => 'Super Sécurité',
            'driver' => MarketingEmailAccountDriver::Log,
            'smtp_host' => null,
            'smtp_port' => null,
            'smtp_encryption' => null,
            'smtp_username' => null,
            'smtp_password' => null,
            'daily_send_limit' => null,
            'is_active' => true,
            'is_default' => false,
        ];
    }

    public function smtp(): static
    {
        return $this->state(fn (): array => [
            'driver' => MarketingEmailAccountDriver::Smtp,
            'smtp_host' => 'smtp.example.com',
            'smtp_port' => 587,
            'smtp_encryption' => 'tls',
            'smtp_username' => 'user@example.com',
            'smtp_password' => 'secret-password',
        ]);
    }

    public function default(): static
    {
        return $this->state(fn (): array => [
            'is_default' => true,
            'is_active' => true,
        ]);
    }
}
