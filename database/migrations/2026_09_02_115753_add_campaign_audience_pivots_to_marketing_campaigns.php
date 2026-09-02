<?php

use App\Models\MarketingCampaign;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('marketing_campaign_marketing_contact');
        Schema::dropIfExists('marketing_campaign_marketing_list');

        Schema::create('marketing_campaign_marketing_list', function (Blueprint $table) {
            $table->id();
            $table->foreignId('marketing_campaign_id')
                ->constrained(indexName: 'mkt_campaign_list_campaign_fk')
                ->cascadeOnDelete();
            $table->foreignId('marketing_list_id')
                ->constrained(indexName: 'mkt_campaign_list_list_fk')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(
                ['marketing_campaign_id', 'marketing_list_id'],
                'mkt_campaign_list_unique',
            );
        });

        Schema::create('marketing_campaign_marketing_contact', function (Blueprint $table) {
            $table->id();
            $table->foreignId('marketing_campaign_id')
                ->constrained(indexName: 'mkt_campaign_contact_campaign_fk')
                ->cascadeOnDelete();
            $table->foreignId('marketing_contact_id')
                ->constrained(indexName: 'mkt_campaign_contact_contact_fk')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(
                ['marketing_campaign_id', 'marketing_contact_id'],
                'mkt_campaign_contact_unique',
            );
        });

        Schema::table('marketing_campaigns', function (Blueprint $table) {
            $table->foreignId('marketing_list_id')->nullable()->change();
        });

        MarketingCampaign::query()
            ->whereNotNull('marketing_list_id')
            ->orderBy('id')
            ->each(function (MarketingCampaign $campaign): void {
                DB::table('marketing_campaign_marketing_list')->insertOrIgnore([
                    'marketing_campaign_id' => $campaign->id,
                    'marketing_list_id' => $campaign->marketing_list_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_campaign_marketing_contact');
        Schema::dropIfExists('marketing_campaign_marketing_list');
    }
};
