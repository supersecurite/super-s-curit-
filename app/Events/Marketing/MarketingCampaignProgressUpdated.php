<?php

namespace App\Events\Marketing;

use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Mise à jour temps réel d'une campagne (statuts globaux et/ou envoi individuel).
 */
class MarketingCampaignProgressUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public MarketingCampaign $campaign,
        public ?MarketingCampaignSend $send = null,
    ) {}

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('marketing-campaign.'.$this->campaign->uuid),
        ];
    }

    public function broadcastAs(): string
    {
        return 'progress.updated';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'campaign' => [
                ...$this->campaign->toAdminArray(),
                'stats' => $this->campaign->sendStats(),
            ],
            'send' => $this->send?->toAdminArray(),
        ];
    }
}
