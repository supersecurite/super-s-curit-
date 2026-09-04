<?php

use App\Models\MarketingContact;
use App\Models\MarketingMessageTemplate;
use App\Support\Marketing\WhatsAppTemplatePayloadAdapter;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('adapter returns empty components when template has no variables', function () {
    $template = MarketingMessageTemplate::factory()->whatsapp()->create([
        'meta_template_name' => 'hello_world',
        'body' => 'Bienvenue sur Super Sécurité.',
        'subject' => 'Notification',
    ]);

    $contact = MarketingContact::factory()->create([
        'name' => 'Mamadou Camara',
    ]);

    $components = WhatsAppTemplatePayloadAdapter::buildComponents($template, $contact);

    expect($components)->toBeEmpty();
});

test('adapter builds typed body components matching template variables', function () {
    $template = MarketingMessageTemplate::factory()->whatsapp()->create([
        'meta_template_name' => 'promo_site',
        'body' => 'Bonjour {{1}}, offre pour {{2}}. Contactez-nous au {{3}}.',
        'subject' => null,
    ]);

    $contact = MarketingContact::factory()->create([
        'name' => 'Aissatou Diallo',
        'is_company' => true,
        'company_name' => 'Mines SA',
        'phone' => '+224621630916',
    ]);

    $components = WhatsAppTemplatePayloadAdapter::buildComponents($template, $contact);

    expect($components)->toHaveCount(1)
        ->and($components[0]['type'])->toBe('body')
        ->and($components[0]['parameters'])->toHaveCount(3)
        ->and($components[0]['parameters'][0]['text'])->toBe('Aissatou Diallo')
        ->and($components[0]['parameters'][1]['text'])->toBe('Mines SA')
        ->and($components[0]['parameters'][2]['text'])->toBe('+224621630916');
});

test('adapter builds header and body components when both have variables', function () {
    $template = MarketingMessageTemplate::factory()->whatsapp()->create([
        'meta_template_name' => 'devis_client',
        'subject' => 'Alerte pour {{1}}',
        'body' => 'Votre devis pour {{1}} chez {{2}} est prêt.',
    ]);

    $contact = MarketingContact::factory()->create([
        'name' => 'Ibrahima Bah',
        'is_company' => true,
        'company_name' => 'Banque Pro',
    ]);

    $components = WhatsAppTemplatePayloadAdapter::buildComponents($template, $contact);

    expect($components)->toHaveCount(2)
        ->and($components[0]['type'])->toBe('header')
        ->and($components[0]['parameters'][0]['text'])->toBe('Ibrahima Bah')
        ->and($components[1]['type'])->toBe('body')
        ->and($components[1]['parameters'][0]['text'])->toBe('Ibrahima Bah')
        ->and($components[1]['parameters'][1]['text'])->toBe('Banque Pro');
});
