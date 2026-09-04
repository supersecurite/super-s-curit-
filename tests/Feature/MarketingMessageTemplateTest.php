<?php

use App\Enums\MarketingMessageTemplateChannel;
use App\Enums\WhatsAppAccountDriver;
use App\Models\MarketingContact;
use App\Models\MarketingMessageTemplate;
use App\Models\User;
use App\Models\WhatsAppAccount;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('commercial can create email message template', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($commercial)->post(route('marketing-templates.store'), [
        'name' => 'Relance prospect',
        'channel' => MarketingMessageTemplateChannel::Email->value,
        'subject' => 'Votre demande Super Sécurité',
        'body' => 'Bonjour {{prenom}} {{nom}}, merci pour votre intérêt.',
    ]);

    $response->assertRedirect();

    $template = MarketingMessageTemplate::query()->where('name', 'Relance prospect')->firstOrFail();

    expect($template->channel)->toBe(MarketingMessageTemplateChannel::Email)
        ->and($template->subject)->toBe('Votre demande Super Sécurité');
});

test('contributor without marketing campaigns permission cannot access templates', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('marketing-templates.index'))
        ->assertForbidden();
});

test('commercial can create whatsapp meta template with preview body and header', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($commercial)
        ->post(route('marketing-templates.store'), [
            'name' => 'Hello Meta',
            'channel' => MarketingMessageTemplateChannel::WhatsApp->value,
            'meta_template_name' => 'hello_world',
            'meta_template_language' => 'fr',
            'body' => 'Bonjour {{1}}, bienvenue chez Super Sécurité.',
            'subject' => 'En-tête Meta',
        ])
        ->assertRedirect();

    $template = MarketingMessageTemplate::query()->where('name', 'Hello Meta')->firstOrFail();

    expect($template->channel)->toBe(MarketingMessageTemplateChannel::WhatsApp)
        ->and($template->meta_template_name)->toBe('hello_world')
        ->and($template->meta_template_language)->toBe('fr')
        ->and($template->subject)->toBe('En-tête Meta')
        ->and($template->body)->toBe('Bonjour {{1}}, bienvenue chez Super Sécurité.');
});

test('whatsapp template requires meta template name', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($commercial)
        ->post(route('marketing-templates.store'), [
            'name' => 'Sans Meta',
            'channel' => MarketingMessageTemplateChannel::WhatsApp->value,
            'meta_template_language' => 'fr',
        ])
        ->assertSessionHasErrors('meta_template_name');
});

test('email template requires subject', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($commercial)
        ->post(route('marketing-templates.store'), [
            'name' => 'Sans objet',
            'channel' => MarketingMessageTemplateChannel::Email->value,
            'body' => 'Contenu minimal.',
        ])
        ->assertSessionHasErrors('subject');
});

test('message template variables are rendered for contact', function () {
    $contact = MarketingContact::factory()->create([
        'is_company' => true,
        'name' => 'Aissata Diallo',
        'company_name' => 'Super Sécurité',
    ]);

    $rendered = RenderMarketingMessageTemplate::render(
        'Bonjour {{prenom}} {{nom}} de {{entreprise}}',
        $contact,
    );

    expect($rendered)->toBe('Bonjour Aissata Diallo de Super Sécurité');
});

test('lexical template body is converted to plain text before rendering', function () {
    $contact = MarketingContact::factory()->create([
        'name' => 'Aissata Diallo',
    ]);

    $lexicalBody = json_encode([
        'root' => [
            'type' => 'root',
            'children' => [
                [
                    'type' => 'paragraph',
                    'children' => [
                        ['type' => 'text', 'text' => 'Bonjour '],
                        ['type' => 'template-variable', 'text' => '{{prenom}}', 'variable' => 'prenom'],
                        ['type' => 'text', 'text' => ' !'],
                    ],
                ],
            ],
        ],
    ], JSON_THROW_ON_ERROR);

    $rendered = RenderMarketingMessageTemplate::render($lexicalBody, $contact);

    expect($rendered)->toBe('Bonjour Aissata !');
});

test('commercial can view template show page', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $template = MarketingMessageTemplate::factory()->create();

    $this->actingAs($commercial)
        ->get(route('marketing-templates.show', $template))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('template.name')
            ->has('variables'));
});

test('commercial can fetch available meta templates', function () {
    $this->seed(RoleUserSeeder::class);

    WhatsAppAccount::factory()->create([
        'driver' => WhatsAppAccountDriver::Log,
        'is_active' => true,
        'is_default' => true,
    ]);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($commercial)
        ->getJson(route('marketing-templates.meta-fetch'))
        ->assertOk()
        ->assertJsonPath('success', true);

    expect($response->json('templates'))->toBeArray()
        ->and(count($response->json('templates')))->toBeGreaterThan(0);
});

test('commercial can import meta templates into application', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($commercial)
        ->post(route('marketing-templates.meta-import'), [
            'templates' => [
                [
                    'name' => 'notification_securite',
                    'language' => 'fr',
                    'title' => 'Notification Sécurité Client',
                    'body_text' => 'Bonjour {{1}}, votre demande pour {{2}} est validée.',
                    'header_text' => 'Super Sécurité Info',
                ],
                [
                    'name' => 'devis_gardiennage',
                    'language' => 'fr',
                    'title' => 'Devis Gardiennage',
                    'body_text' => 'Bonjour {{1}}, voici votre proposition {{2}}.',
                ],
            ],
        ]);

    $response->assertRedirect(route('marketing-templates.index', ['channel' => 'whatsapp']));

    $template1 = MarketingMessageTemplate::query()
        ->where('meta_template_name', 'notification_securite')
        ->first();

    expect($template1)->not->toBeNull()
        ->and($template1->channel)->toBe(MarketingMessageTemplateChannel::WhatsApp)
        ->and($template1->name)->toBe('Notification Sécurité Client')
        ->and($template1->subject)->toBe('Super Sécurité Info')
        ->and($template1->body)->toBe('Bonjour {{1}}, votre demande pour {{2}} est validée.');

    $template2 = MarketingMessageTemplate::query()
        ->where('meta_template_name', 'devis_gardiennage')
        ->first();

    expect($template2)->not->toBeNull()
        ->and($template2->name)->toBe('Devis Gardiennage');
});

test('commercial can delete template and is redirected back or to channel index', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $template = MarketingMessageTemplate::factory()->create([
        'channel' => MarketingMessageTemplateChannel::WhatsApp,
    ]);

    // Deletion when coming from the index page with search query
    $indexUrl = route('marketing-templates.index', ['channel' => 'whatsapp', 'search' => 'test']);
    $this->actingAs($commercial)
        ->from($indexUrl)
        ->delete(route('marketing-templates.destroy', $template))
        ->assertRedirect($indexUrl);

    expect(MarketingMessageTemplate::query()->find($template->id))->toBeNull();

    // Deletion when coming from the show page itself
    $template2 = MarketingMessageTemplate::factory()->create([
        'channel' => MarketingMessageTemplateChannel::WhatsApp,
    ]);
    $showUrl = route('marketing-templates.show', $template2);

    $this->actingAs($commercial)
        ->from($showUrl)
        ->delete(route('marketing-templates.destroy', $template2))
        ->assertRedirect(route('marketing-templates.index', ['channel' => 'whatsapp']));

    expect(MarketingMessageTemplate::query()->find($template2->id))->toBeNull();
});
