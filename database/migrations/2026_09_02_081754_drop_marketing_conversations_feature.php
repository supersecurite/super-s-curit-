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
        Schema::dropIfExists('marketing_conversation_messages');
        Schema::dropIfExists('marketing_conversations');

        if (! Schema::hasColumn('marketing_campaign_sends', 'reply_token')) {
            return;
        }

        Schema::table('marketing_campaign_sends', function (Blueprint $table) {
            $table->dropUnique(['reply_token']);
        });

        Schema::table('marketing_campaign_sends', function (Blueprint $table) {
            $table->dropColumn('reply_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Feature retirée volontairement — pas de restauration.
    }
};
