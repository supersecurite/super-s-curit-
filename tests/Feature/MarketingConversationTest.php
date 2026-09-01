<?php

use App\Enums\MarketingConversationMessageDirection;
use App\Mail\MarketingCampaignMailable;
use App\Mail\MarketingConversationReplyMailable;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Models\MarketingConversation;
use App\Models\MarketingConversationMessage;
use App\Models\User;
use App\Support\Marketing\MarketingReplyAddress;
use Database\Seeders\RoleUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('commercial can list marketing conversations', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    MarketingConversation::factory()->create();

    $this->actingAs($commercial)
        ->get(route('marketing-conversations.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('conversations.data'));
});

test('contributor without marketing permission cannot access conversations', function () {
    $this->seed(RoleUserSeeder::class);

    $user = User::query()->where('email', 'user@supersecurite.com')->firstOrFail();

    $this->actingAs($user)
        ->get(route('marketing-conversations.index'))
        ->assertForbidden();
});

test('inbound webhook records reply linked to campaign send', function () {
    config([
        'marketing.inbound_webhook_token' => 'test-webhook-token',
        'marketing.reply_mailbox' => 'notifications',
        'marketing.reply_domain' => 'supersecurite.com',
    ]);

    $send = MarketingCampaignSend::factory()->create([
        'reply_token' => (string) Str::uuid(),
        'recipient_email' => 'client@example.com',
    ]);

    $replyAddress = MarketingReplyAddress::forSend($send);

    $response = $this->postJson(route('webhooks.marketing.inbound-email'), [
        'from_email' => 'client@example.com',
        'to_email' => $replyAddress,
        'subject' => 'Re: Offre printemps',
        'body_text' => 'Merci pour votre message.',
        'email_message_id' => '<inbound-1@example.com>',
    ], [
        'X-Marketing-Webhook-Token' => 'test-webhook-token',
    ]);

    $response->assertOk()->assertJsonPath('accepted', true);

    $conversation = MarketingConversation::query()->firstOrFail();

    expect($conversation->marketing_contact_id)->toBe($send->marketing_contact_id)
        ->and($conversation->unread_inbound_count)->toBe(1)
        ->and(MarketingConversationMessage::query()->count())->toBe(1)
        ->and(MarketingConversationMessage::query()->first()->direction)
        ->toBe(MarketingConversationMessageDirection::Inbound);
});

test('commercial can reply in conversation thread', function () {
    Mail::fake();
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $contact = MarketingContact::factory()->create(['email' => 'client@example.com']);
    $conversation = MarketingConversation::factory()->create([
        'marketing_contact_id' => $contact->id,
        'subject' => 'Suivi commercial',
    ]);

    $this->actingAs($commercial)
        ->post(route('marketing-conversations.reply', $conversation), [
            'body' => 'Bonjour, merci pour votre retour.',
        ])
        ->assertRedirect(route('marketing-conversations.show', $conversation));

    expect(MarketingConversationMessage::query()->where('direction', MarketingConversationMessageDirection::Outbound)->count())
        ->toBe(1);

    Mail::assertSent(MarketingConversationReplyMailable::class);
});

test('campaign mailable sets reply-to address with send token', function () {
    config([
        'marketing.reply_mailbox' => 'notifications',
        'marketing.reply_domain' => 'supersecurite.com',
    ]);

    $send = MarketingCampaignSend::factory()->create([
        'reply_token' => 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    ]);

    $mailable = new MarketingCampaignMailable($send);
    $envelope = $mailable->envelope();

    expect($envelope->replyTo[0]->address)
        ->toBe('notifications+aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee@supersecurite.com');
});

test('viewing conversation marks inbound messages as read', function () {
    $this->seed(RoleUserSeeder::class);

    $commercial = User::query()->where('email', 'commercial@supersecurite.com')->firstOrFail();
    $conversation = MarketingConversation::factory()->create([
        'unread_inbound_count' => 2,
    ]);

    $this->actingAs($commercial)
        ->get(route('marketing-conversations.show', $conversation))
        ->assertOk();

    expect($conversation->fresh()->unread_inbound_count)->toBe(0);
});
