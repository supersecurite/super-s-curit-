<?php

namespace Database\Factories;

use App\Enums\MarketingMessageTemplateChannel;
use App\Models\MarketingMessageTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingMessageTemplate>
 */
class MarketingMessageTemplateFactory extends Factory
{
    protected $model = MarketingMessageTemplate::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'channel' => MarketingMessageTemplateChannel::Email,
            'subject' => fake()->sentence(),
            'body' => 'Bonjour {{prenom}} {{nom}},'."\n\n".fake()->paragraph(),
        ];
    }

    public function whatsapp(): static
    {
        return $this->state(fn (array $attributes) => [
            'channel' => MarketingMessageTemplateChannel::WhatsApp,
            'subject' => null,
            'body' => '',
            'meta_template_name' => 'hello_world',
            'meta_template_language' => 'fr',
        ]);
    }
}
