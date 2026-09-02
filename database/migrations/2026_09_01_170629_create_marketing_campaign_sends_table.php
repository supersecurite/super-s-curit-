<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('marketing_campaign_sends')) {
            Schema::create('marketing_campaign_sends', function (Blueprint $table) {
                $table->id();
                $table->uuid()->unique();
                $table->foreignId('marketing_campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('marketing_contact_id')->constrained()->cascadeOnDelete();
                $table->string('recipient_email')->nullable();
                $table->string('recipient_phone')->nullable();
                $table->string('recipient_name')->nullable();
                $table->string('status')->default('queued');
                $table->string('subject')->nullable();
                $table->longText('body_html')->nullable();
                $table->uuid('open_token')->unique();
                $table->timestamp('queued_at')->nullable();
                $table->timestamp('sent_at')->nullable();
                $table->timestamp('delivered_at')->nullable();
                $table->timestamp('read_at')->nullable();
                $table->timestamp('failed_at')->nullable();
                $table->text('failure_reason')->nullable();
                $table->string('provider_message_id')->nullable();
                $table->timestamps();

                // Nom explicite : l'index auto-généré dépasse la limite MySQL (64 car.).
                $table->unique(['marketing_campaign_id', 'marketing_contact_id'], 'mkt_campaign_send_contact_unique');
            });

            return;
        }

        // Reprise prod : table créée lors d'une migration précédente interrompue.
        Schema::whenTableDoesntHaveIndex(
            'marketing_campaign_sends',
            'mkt_campaign_send_contact_unique',
            function (Blueprint $table): void {
                $table->unique(['marketing_campaign_id', 'marketing_contact_id'], 'mkt_campaign_send_contact_unique');
            },
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketing_campaign_sends');
    }
};
