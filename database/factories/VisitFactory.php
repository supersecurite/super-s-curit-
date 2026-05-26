<?php

namespace Database\Factories;

use App\Models\Visit;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Visit>
 */
class VisitFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
        $platforms = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'];
        $devices = ['desktop', 'mobile', 'tablet'];
        $paths = ['/', '/a-propos', '/contact', '/services', '/projets'];

        return [
            'visitor_uuid' => (string) Str::uuid(),
            'session_id' => Str::random(40),
            'user_id' => null,
            'path' => fake()->randomElement($paths),
            'url' => config('app.url').fake()->randomElement($paths),
            'query_string' => null,
            'referrer' => fake()->optional(0.3)->url(),
            'referrer_domain' => fake()->optional(0.3)->domainName(),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'browser' => fake()->randomElement($browsers),
            'browser_version' => fake()->numerify('##.0.#'),
            'platform' => fake()->randomElement($platforms),
            'device' => fake()->randomElement($devices),
            'country_code' => fake()->randomElement(['GN', 'FR', 'SN', 'CI', 'US']),
            'country' => fake()->randomElement(['Guinée', 'France', 'Sénégal', "Côte d'Ivoire", 'États-Unis']),
            'duration_seconds' => fake()->optional(0.6)->numberBetween(5, 600),
            'is_bot' => false,
            'is_bounce' => fake()->boolean(30),
        ];
    }

    public function bot(): static
    {
        return $this->state(['is_bot' => true, 'device' => 'bot']);
    }
}
