<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('marketing_campaign_sends')
            ->where('status', 'delivered')
            ->update(['status' => 'received']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('marketing_campaign_sends')
            ->where('status', 'received')
            ->update(['status' => 'delivered']);
    }
};
