<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketing_campaigns', function (Blueprint $table) {
            $table->foreignId('whatsapp_account_id')
                ->nullable()
                ->after('marketing_message_template_id')
                ->constrained('whatsapp_accounts')
                ->nullOnDelete();
        });

        if (! Schema::hasColumn('marketing_campaign_sends', 'recipient_phone')) {
            Schema::table('marketing_campaign_sends', function (Blueprint $table) {
                $table->string('recipient_phone')->nullable()->after('recipient_email');
            });
        }
    }

    public function down(): void
    {
        Schema::table('marketing_campaigns', function (Blueprint $table) {
            $table->dropConstrainedForeignId('whatsapp_account_id');
        });

        if (Schema::hasColumn('marketing_campaign_sends', 'recipient_phone')) {
            Schema::table('marketing_campaign_sends', function (Blueprint $table) {
                $table->dropColumn('recipient_phone');
            });
        }
    }
};
