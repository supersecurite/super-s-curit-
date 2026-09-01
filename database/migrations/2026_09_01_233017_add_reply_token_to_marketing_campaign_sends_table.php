<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('marketing_campaign_sends', function (Blueprint $table) {
            $table->uuid('reply_token')->nullable()->unique()->after('open_token');
        });

        DB::table('marketing_campaign_sends')
            ->whereNull('reply_token')
            ->orderBy('id')
            ->lazyById()
            ->each(function (object $send): void {
                DB::table('marketing_campaign_sends')
                    ->where('id', $send->id)
                    ->update(['reply_token' => (string) Str::uuid()]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marketing_campaign_sends', function (Blueprint $table) {
            $table->dropColumn('reply_token');
        });
    }
};
