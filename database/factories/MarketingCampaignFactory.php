<?php

namespace Database\Factories;

use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingCampaignStatus;
use App\Models\MarketingCampaign;
use App\Models\MarketingEmailAccount;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingCampaign>
 */
class MarketingCampaignFactory extends Factory
{
    protected $model = MarketingCampaign::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'channel' => MarketingCampaignChannel::Email,
            'status' => MarketingCampaignStatus::Draft,
            'marketing_list_id' => MarketingList::factory(),
            'marketing_message_template_id' => MarketingMessageTemplate::factory(),
            'marketing_email_account_id' => MarketingEmailAccount::factory(),
            'subject' => fake()->sentence(),
            'body' => 'Bonjour {{prenom}} {{nom}},'."\n\n".fake()->paragraph(),
            'created_by' => User::factory(),
        ];
    }

    public function launched(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MarketingCampaignStatus::Sending,
            'launched_at' => now(),
        ]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (MarketingCampaign $campaign): void {
            if ($campaign->marketing_list_id === null) {
                return;
            }

            if ($campaign->lists()->where('marketing_lists.id', $campaign->marketing_list_id)->exists()) {
                return;
            }

            $campaign->lists()->syncWithoutDetaching([$campaign->marketing_list_id]);
        });
    }
}
