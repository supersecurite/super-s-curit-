<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('access_logs', function (Blueprint $table) {
            $table->string('browser', 64)->nullable()->after('user_agent');
            $table->string('browser_version', 32)->nullable()->after('browser');
            $table->string('platform', 64)->nullable()->after('browser_version');
            $table->string('country_code', 2)->nullable()->after('platform');
            $table->string('country', 100)->nullable()->after('country_code');
        });
    }

    public function down(): void
    {
        Schema::table('access_logs', function (Blueprint $table) {
            $table->dropColumn([
                'browser',
                'browser_version',
                'platform',
                'country_code',
                'country',
            ]);
        });
    }
};
