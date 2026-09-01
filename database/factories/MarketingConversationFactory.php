<?php

namespace Database\Factories;

use App\Models\MarketingContact;
use App\Models\MarketingConversation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingConversation>
 */
class MarketingConversationFactory extends Factory
{
    protected $model = MarketingConversation::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'marketing_contact_id' => MarketingContact::factory(),
            'subject' => fake()->sentence(),
            'unread_inbound_count' => 0,
            'last_message_at' => now(),
        ];
    }
}
