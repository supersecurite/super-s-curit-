<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_offers', function (Blueprint $table) {
            $table->string('title_zh')->nullable()->after('title_en');
            $table->string('location_zh')->nullable()->after('location_en');
            $table->string('contract_type_zh')->nullable()->after('contract_type_en');
            $table->longText('description_zh')->nullable()->after('description_en');
        });
    }

    public function down(): void
    {
        Schema::table('job_offers', function (Blueprint $table) {
            $table->dropColumn([
                'title_zh',
                'location_zh',
                'contract_type_zh',
                'description_zh',
            ]);
        });
    }
};
