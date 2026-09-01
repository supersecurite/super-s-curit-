<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('phone');
            $table->text('company_contacts')->nullable()->after('company_name');
            $table->text('address')->nullable()->after('company_contacts');
        });
    }

    public function down(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'company_contacts', 'address']);
        });
    }
};
