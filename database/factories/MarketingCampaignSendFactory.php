<?php

namespace Database\Factories;

use App\Enums\MarketingCampaignSendStatus;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingCampaignSend>
 */
class MarketingCampaignSendFactory extends Factory
{
    protected $model = MarketingCampaignSend::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'marketing_campaign_id' => MarketingCampaign::factory()->launched(),
            'marketing_contact_id' => MarketingContact::factory(),
            'recipient_email' => fake()->safeEmail(),
            'recipient_name' => fake()->name(),
            'status' => MarketingCampaignSendStatus::Queued,
            'subject' => fake()->sentence(),
            'body_html' => '<p>'.fake()->paragraph().'</p>',
            'queued_at' => now(),
        ];
    }

    public function delivered(): static
    {
        return $this->received();
    }

    public function received(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MarketingCampaignSendStatus::Received,
            'sent_at' => now(),
            'delivered_at' => now(),
        ]);
    }
}
