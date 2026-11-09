<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_offers', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->string('location_en')->nullable()->after('location');
            $table->string('contract_type_en')->nullable()->after('contract_type');
            $table->longText('description_en')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('job_offers', function (Blueprint $table) {
            $table->dropColumn([
                'title_en',
                'location_en',
                'contract_type_en',
                'description_en',
            ]);
        });
    }
};
