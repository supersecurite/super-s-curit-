<?php

namespace Database\Factories;

use App\Enums\AccessLogKind;
use App\Models\AccessLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AccessLog>
 */
class AccessLogFactory extends Factory
{
    protected $model = AccessLog::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'kind' => AccessLogKind::Visit,
            'http_method' => 'GET',
            'route_name' => 'dashboard',
            'ip' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'browser' => 'Chrome',
            'browser_version' => '120.0',
            'platform' => 'Windows',
            'country_code' => 'GN',
            'country' => 'Guinée',
            'page' => fake()->url(),
            'description' => fake()->sentence(),
            'visited_at' => now(),
        ];
    }

    public function action(): static
    {
        return $this->state(fn (): array => [
            'kind' => AccessLogKind::Action,
            'http_method' => 'POST',
        ]);
    }
}
