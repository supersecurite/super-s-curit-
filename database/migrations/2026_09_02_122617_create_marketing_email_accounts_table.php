<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_email_accounts', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('name');
            $table->string('from_address');
            $table->string('from_name')->nullable();
            $table->string('driver')->default('smtp');
            $table->string('smtp_host')->nullable();
            $table->unsignedSmallInteger('smtp_port')->nullable();
            $table->string('smtp_encryption')->nullable();
            $table->string('smtp_username')->nullable();
            $table->text('smtp_password')->nullable();
            $table->unsignedInteger('daily_send_limit')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::table('marketing_campaigns', function (Blueprint $table) {
            $table->foreignId('marketing_email_account_id')
                ->nullable()
                ->after('whatsapp_account_id')
                ->constrained('marketing_email_accounts', indexName: 'mkt_campaigns_email_account_fk')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('marketing_campaigns', function (Blueprint $table) {
            $table->dropConstrainedForeignId('marketing_email_account_id');
        });

        Schema::dropIfExists('marketing_email_accounts');
    }
};
