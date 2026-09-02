<?php

use App\Models\MarketingContact;
use App\Models\User;
use App\Support\Marketing\RenderMarketingMessageTemplate;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleUserSeeder::class);
    Storage::fake('public');
});

test('commercial can upload marketing editor image', function () {
    $user = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();

    $response = $this->actingAs($user)
        ->postJson(route('marketing-editor-images.store'), [
            'image' => UploadedFile::fake()->image('banner.jpg', 800, 400),
        ])
        ->assertOk()
        ->assertJsonStructure(['url', 'path']);

    $path = $response->json('path');
    expect($path)->toStartWith('marketing/editor-images/')
        ->and(Storage::disk('public')->exists($path))->toBeTrue();
});

test('contributor cannot upload marketing editor image', function () {
    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->postJson(route('marketing-editor-images.store'), [
            'image' => UploadedFile::fake()->image('banner.jpg'),
        ])
        ->assertForbidden();
});

test('lexical html renderer includes absolute image urls', function () {
    $content = json_encode([
        'root' => [
            'type' => 'root',
            'children' => [
                [
                    'type' => 'paragraph',
                    'children' => [
                        ['type' => 'text', 'text' => 'Bonjour'],
                    ],
                ],
                [
                    'type' => 'image',
                    'src' => '/storage/marketing/editor-images/demo.jpg',
                    'alt' => 'Demo',
                ],
            ],
        ],
    ], JSON_THROW_ON_ERROR);

    $contact = MarketingContact::factory()->create([
        'first_name' => 'Ada',
    ]);

    $html = RenderMarketingMessageTemplate::renderHtml($content, $contact);

    expect($html)->toContain('<img src="')
        ->and($html)->toContain('/storage/marketing/editor-images/demo.jpg')
        ->and($html)->toContain('Bonjour')
        ->and($html)->not->toContain('data:');
});
