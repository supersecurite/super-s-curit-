<?php

use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Models\User;
use App\Services\Marketing\MarketingContactImportService;
use App\Support\Marketing\ResolveMarketingContactChannels;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

test('commercial can create marketing contact', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $companyContacts = [
        ['type' => 'email', 'value' => 'compta@example.com', 'label' => 'Compta'],
        ['type' => 'whatsapp', 'value' => '+224600000002', 'label' => null],
    ];

    $response = $this->actingAs($commercial)->post(route('marketing-clients.store'), [
        'first_name' => 'Aissata',
        'last_name' => 'Diallo',
        'email' => 'aissata@example.com',
        'phone' => '+224612345678',
        'is_company' => '1',
        'company_name' => 'Super Sécurité Guinée',
        'company_role' => 'Directrice commerciale',
        'company_contacts' => json_encode($companyContacts),
        'address' => 'Immeuble Kaloum, Conakry',
        'marketing_consent' => '1',
        'tags' => 'prospect, client',
    ]);

    $response->assertRedirect(route('marketing-clients.index'));

    $contact = MarketingContact::query()->where('email', 'aissata@example.com')->firstOrFail();

    expect($contact->company_role)->toBe('Directrice commerciale')
        ->and($contact->is_company)->toBeTrue()
        ->and($contact->company_contacts)->toBe($companyContacts);

    $campaign = ResolveMarketingContactChannels::forCampaign($contact);

    expect($campaign['emails'])->toHaveCount(2)
        ->and($campaign['whatsapp'])->toHaveCount(1)
        ->and($campaign['cc_emails'])->toBe(['compta@example.com']);
});

test('contributor without marketing permission cannot access contacts', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('marketing-clients.index'))
        ->assertForbidden();
});

test('commercial can import contacts from csv with duplicate report', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    MarketingContact::factory()->create([
        'email' => 'existing@example.com',
        'phone' => '+224600000001',
    ]);

    $csv = <<<'CSV'
prenom,nom,email,telephone,consentement
Mamadou,Camara,new@example.com,+224611111111,oui
Fatou,Bah,existing@example.com,+224622222222,non
CSV;

    $file = UploadedFile::fake()->createWithContent('contacts.csv', $csv);

    $response = $this->actingAs($commercial)->post(route('marketing-clients.import.store'), [
        'file' => $file,
    ]);

    $response->assertRedirect(route('marketing-clients.import'));

    expect(MarketingContact::query()->count())->toBe(2)
        ->and(MarketingContact::query()->where('email', 'new@example.com')->exists())->toBeTrue();
});

test('marketing contact requires email or phone', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($commercial)
        ->post(route('marketing-clients.store'), [
            'first_name' => 'Sans',
            'last_name' => 'Contact',
        ])
        ->assertSessionHasErrors('email');
});

test('commercial can view marketing contact show page', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $contact = MarketingContact::factory()->create();

    $this->actingAs($commercial)
        ->get(route('marketing-clients.show', $contact))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('contact.campaign_channels.emails')
            ->has('contact.company_contacts')
            ->has('contact.company_role'));
});

test('contributor cannot import contacts', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $file = UploadedFile::fake()->createWithContent('contacts.csv', "email\ntest@example.com\n");

    $this->actingAs($user)
        ->post(route('marketing-clients.import.store'), ['file' => $file])
        ->assertForbidden();
});

test('commercial can download import template csv', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($commercial)
        ->get(route('marketing-clients.import.template'));

    $response->assertOk()
        ->assertDownload('modele-import-contacts.csv');

    expect($response->streamedContent())
        ->toContain('prenom')
        ->toContain('role_entreprise')
        ->toContain('aissata@example.com')
        ->toContain('compta@example.com');
});

test('contributor cannot download import template', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('marketing-clients.import.template'))
        ->assertForbidden();
});

test('import template csv can be imported successfully', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $template = app(MarketingContactImportService::class)->templateCsv();

    $file = UploadedFile::fake()->createWithContent('modele-import-contacts.csv', $template);

    $this->actingAs($commercial)
        ->post(route('marketing-clients.import.store'), ['file' => $file])
        ->assertRedirect(route('marketing-clients.import'));

    $contact = MarketingContact::query()->where('email', 'aissata@example.com')->firstOrFail();

    expect($contact->company_role)->toBe('Directrice commerciale')
        ->and($contact->company_contacts)->toBeArray()
        ->and($contact->company_contacts[0]['type'])->toBe('email');
});

test('marketing contact accepts formatted international phone numbers', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($commercial)
        ->post(route('marketing-clients.store'), [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1 (555) 670-8636',
            'is_company' => '1',
            'company_contacts' => json_encode([
                ['type' => 'whatsapp', 'value' => '+224 622 999 888', 'label' => 'WhatsApp'],
            ]),
        ])
        ->assertRedirect(route('marketing-clients.index'));

    $contact = MarketingContact::query()->where('email', 'john.doe@example.com')->firstOrFail();

    expect($contact->phone)->toBe('+15556708636')
        ->and($contact->company_contacts[0]['value'])->toBe('+224622999888');
});

test('commercial can create marketing contact associated to lists', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $listA = MarketingList::factory()->create(['name' => 'Prospects']);
    $listB = MarketingList::factory()->create(['name' => 'VIP']);

    $this->actingAs($commercial)
        ->post(route('marketing-clients.store'), [
            'first_name' => 'Fatou',
            'last_name' => 'Bah',
            'email' => 'fatou.bah@example.com',
            'phone' => '+224622111222',
            'list_uuids' => [$listA->uuid, $listB->uuid],
        ])
        ->assertRedirect(route('marketing-clients.index'));

    $contact = MarketingContact::query()->where('email', 'fatou.bah@example.com')->firstOrFail();

    expect($contact->lists()->pluck('uuid')->sort()->values()->all())
        ->toBe(collect([$listA->uuid, $listB->uuid])->sort()->values()->all());
});

test('company contact channel values are validated', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($commercial)
        ->post(route('marketing-clients.store'), [
            'first_name' => 'Test',
            'last_name' => 'Invalid',
            'email' => 'test-invalid@example.com',
            'is_company' => '1',
            'company_contacts' => json_encode([
                ['type' => 'email', 'value' => 'not-an-email'],
            ]),
        ])
        ->assertSessionHasErrors('company_contacts.0.value');
});

test('particulier contact clears company fields on save', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $this->actingAs($commercial)
        ->post(route('marketing-clients.store'), [
            'first_name' => 'Mamadou',
            'last_name' => 'Camara',
            'email' => 'mamadou@example.com',
            'is_company' => '0',
            'company_name' => 'Ne doit pas être enregistré',
            'company_role' => 'Ne doit pas être enregistré',
            'company_contacts' => json_encode([
                ['type' => 'email', 'value' => 'ignore@example.com'],
            ]),
            'address' => 'Quartier Hamdallaye',
        ])
        ->assertRedirect(route('marketing-clients.index'));

    $contact = MarketingContact::query()->where('email', 'mamadou@example.com')->firstOrFail();

    expect($contact->is_company)->toBeFalse()
        ->and($contact->company_name)->toBeNull()
        ->and($contact->company_role)->toBeNull()
        ->and($contact->company_contacts)->toBeNull()
        ->and($contact->address)->toBe('Quartier Hamdallaye');
});
