<?php

namespace Database\Factories;

use App\Enums\MarketingConversationMessageDirection;
use App\Models\MarketingConversation;
use App\Models\MarketingConversationMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingConversationMessage>
 */
class MarketingConversationMessageFactory extends Factory
{
    protected $model = MarketingConversationMessage::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'marketing_conversation_id' => MarketingConversation::factory(),
            'direction' => MarketingConversationMessageDirection::Inbound,
            'from_email' => fake()->safeEmail(),
            'to_email' => 'notifications@example.com',
            'subject' => fake()->sentence(),
            'body_text' => fake()->paragraph(),
            'body_html' => '<p>'.fake()->paragraph().'</p>',
            'sent_at' => now(),
        ];
    }

    public function outbound(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => MarketingConversationMessageDirection::Outbound,
        ]);
    }
}
