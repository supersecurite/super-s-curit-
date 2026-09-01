<?php

namespace App\Support\Marketing;

use App\Models\MarketingCampaignSend;
use App\Models\MarketingConversation;

final class MarketingReplyAddress
{
    public static function forSend(MarketingCampaignSend $send): string
    {
        return self::forToken($send->reply_token);
    }

    public static function forConversation(MarketingConversation $conversation): string
    {
        return self::forToken($conversation->reply_token);
    }

    public static function forToken(string $token): string
    {
        $mailbox = config('marketing.reply_mailbox');
        $domain = config('marketing.reply_domain');

        return "{$mailbox}+{$token}@{$domain}";
    }

    public static function extractTokenFromAddress(string $address): ?string
    {
        $mailbox = preg_quote((string) config('marketing.reply_mailbox'), '/');
        $domain = preg_quote((string) config('marketing.reply_domain'), '/');

        if (preg_match("/^{$mailbox}\\+([a-f0-9\\-]{36})@{$domain}$/i", strtolower(trim($address)), $matches) === 1) {
            return $matches[1];
        }

        return null;
    }
}
