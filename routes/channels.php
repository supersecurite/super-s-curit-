<?php

use App\Models\MarketingCampaign;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('marketing-campaign.{uuid}', function ($user, string $uuid) {
    $campaign = MarketingCampaign::query()->where('uuid', $uuid)->first();

    return $campaign !== null && $user->can('view', $campaign);
});
