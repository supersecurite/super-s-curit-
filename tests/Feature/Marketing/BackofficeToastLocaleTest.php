<?php

use App\Models\User;
use App\Support\BackofficeLocale;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('bt helper resolves toast and validation from backoffice locale', function () {
    app()->setLocale('en');

    expect(bt('toasts.article_created'))->toBe('News article created successfully.')
        ->and(bt('toasts.campaign_retried', ['count' => 3]))->toBe('Retry queued: 3 failed send(s) re-queued.')
        ->and(bt('validation.title_required'))->toBe('The title is required.');

    app()->setLocale('fr');

    expect(bt('toasts.article_created'))->toBe('Actualité créée avec succès.');
});

test('article store validation messages follow backoffice locale', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->withSession([BackofficeLocale::SESSION_KEY => 'en'])
        ->from(route('articles.create'))
        ->post(route('articles.store'), [])
        ->assertSessionHasErrors(['title']);

    expect(session('errors')->first('title'))->toBe('The title is required.');
});
