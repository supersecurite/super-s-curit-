<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('security_agent_applications', function (Blueprint $table) {
            $table->foreignId('job_offer_id')
                ->nullable()
                ->after('post')
                ->constrained('job_offers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('security_agent_applications', function (Blueprint $table) {
            $table->dropConstrainedForeignId('job_offer_id');
        });
    }
};
