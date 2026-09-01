<?php

namespace App\Enums;

enum MarketingMessageTemplateChannel: string
{
    case Email = 'email';
    case WhatsApp = 'whatsapp';
}
