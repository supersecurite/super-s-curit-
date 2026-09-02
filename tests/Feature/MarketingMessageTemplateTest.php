<?php

use App\Enums\MarketingMessageTemplateChannel;
use App\Models\MarketingContact;
use App\Models\MarketingMessageTemplate;
use App\Models\User;
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

test('commercial can create whatsapp meta template without free body', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($commercial)
        ->post(route('marketing-templates.store'), [
            'name' => 'Hello Meta',
            'channel' => MarketingMessageTemplateChannel::WhatsApp->value,
            'meta_template_name' => 'hello_world',
            'meta_template_language' => 'fr',
            'body' => 'Ceci ne doit pas être utilisé',
            'subject' => 'Ignoré',
        ])
        ->assertRedirect();

    $template = MarketingMessageTemplate::query()->where('name', 'Hello Meta')->firstOrFail();

    expect($template->channel)->toBe(MarketingMessageTemplateChannel::WhatsApp)
        ->and($template->meta_template_name)->toBe('hello_world')
        ->and($template->meta_template_language)->toBe('fr')
        ->and($template->subject)->toBeNull()
        ->and($template->body)->toBe('');
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
        'first_name' => 'Aissata',
        'last_name' => 'Diallo',
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
        'first_name' => 'Aissata',
        'last_name' => 'Diallo',
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
