<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Retire définitivement les tables / colonnes du MVP conversations inbound.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('marketing_conversation_messages');
        Schema::dropIfExists('marketing_conversations');

        Schema::enableForeignKeyConstraints();

        if (! Schema::hasColumn('marketing_campaign_sends', 'reply_token')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            try {
                DB::statement('ALTER TABLE `marketing_campaign_sends` DROP INDEX `marketing_campaign_sends_reply_token_unique`');
            } catch (Throwable) {
                // Index déjà absent.
            }
        } else {
            try {
                Schema::table('marketing_campaign_sends', function (Blueprint $table) {
                    $table->dropUnique(['reply_token']);
                });
            } catch (Throwable) {
                // Index déjà absent.
            }
        }

        Schema::table('marketing_campaign_sends', function (Blueprint $table) {
            $table->dropColumn('reply_token');
        });
    }

    public function down(): void
    {
        // Feature retirée — pas de restauration.
    }
};
