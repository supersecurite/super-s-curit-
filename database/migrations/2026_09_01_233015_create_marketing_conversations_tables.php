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
        Schema::create('marketing_conversations', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('marketing_contact_id')->constrained()->cascadeOnDelete();
            $table->uuid('reply_token')->unique();
            $table->string('subject')->nullable();
            $table->unsignedInteger('unread_inbound_count')->default(0);
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->unique('marketing_contact_id');
        });

        Schema::create('marketing_conversation_messages', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('marketing_conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('marketing_campaign_send_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('direction');
            $table->string('from_email');
            $table->string('to_email');
            $table->string('subject')->nullable();
            $table->longText('body_html')->nullable();
            $table->longText('body_text')->nullable();
            $table->string('email_message_id')->nullable()->unique();
            $table->timestamp('sent_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketing_conversation_messages');
        Schema::dropIfExists('marketing_conversations');
    }
};
