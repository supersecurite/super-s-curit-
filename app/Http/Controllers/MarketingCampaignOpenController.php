<?php

namespace App\Http\Controllers;

use App\Enums\MarketingCampaignSendStatus;
use App\Models\MarketingCampaignSend;
use App\Support\Marketing\BroadcastMarketingCampaignProgress;
use Illuminate\Http\Response;

class MarketingCampaignOpenController extends Controller
{
    public function track(string $openToken): Response
    {
        $send = MarketingCampaignSend::query()
            ->where('open_token', $openToken)
            ->first();

        if ($send !== null && in_array($send->status, [
            MarketingCampaignSendStatus::Sent,
            MarketingCampaignSendStatus::Received,
            MarketingCampaignSendStatus::Delivered,
        ], true)) {
            $send->update([
                'status' => MarketingCampaignSendStatus::Read,
                'read_at' => now(),
            ]);

            $send->load('campaign');

            if ($send->campaign !== null) {
                BroadcastMarketingCampaignProgress::dispatch($send->campaign, $send);
            }
        }

        $pixel = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

        return response($pixel, 200, [
            'Content-Type' => 'image/gif',
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
        ]);
    }
}
