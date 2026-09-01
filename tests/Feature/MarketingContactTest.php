<?php

use App\Models\MarketingContact;
use App\Models\User;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

test('commercial can create marketing contact', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($commercial)->post(route('marketing-clients.store'), [
        'first_name' => 'Aissata',
        'last_name' => 'Diallo',
        'email' => 'aissata@example.com',
        'phone' => '+224612345678',
        'marketing_consent' => '1',
        'tags' => 'prospect, client',
    ]);

    $response->assertRedirect(route('marketing-clients.index'));

    $contact = MarketingContact::query()->where('email', 'aissata@example.com')->first();

    expect($contact)->not->toBeNull()
        ->and($contact->first_name)->toBe('Aissata')
        ->and($contact->marketing_consent)->toBeTrue()
        ->and($contact->tags)->toBe(['prospect', 'client']);
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
        ->assertOk();
});

test('contributor cannot import contacts', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $file = UploadedFile::fake()->createWithContent('contacts.csv', "email\ntest@example.com\n");

    $this->actingAs($user)
        ->post(route('marketing-clients.import.store'), ['file' => $file])
        ->assertForbidden();
});
