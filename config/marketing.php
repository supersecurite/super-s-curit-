<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Adresse de réponse campagnes e-mail
    |--------------------------------------------------------------------------
    |
    | Les destinataires répondent à {mailbox}+{reply_token}@{domain}.
    | Le serveur mail doit acheminer ces messages vers le webhook inbound
    | ou une boîte lue par votre fournisseur (Mailgun, forwarding, etc.).
    |
    */

    'reply_mailbox' => env('MARKETING_REPLY_MAILBOX', 'notifications'),

    'reply_domain' => env('MARKETING_REPLY_DOMAIN', parse_url((string) env('MAIL_FROM_ADDRESS', ''), PHP_URL_HOST) ?: 'localhost'),

    'inbound_webhook_token' => env('MARKETING_INBOUND_WEBHOOK_TOKEN'),

];
