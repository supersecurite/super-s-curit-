<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketing_message_templates', function (Blueprint $table) {
            $table->string('meta_template_name')->nullable()->after('body');
            $table->string('meta_template_language')->nullable()->after('meta_template_name');
        });
    }

    public function down(): void
    {
        Schema::table('marketing_message_templates', function (Blueprint $table) {
            $table->dropColumn(['meta_template_name', 'meta_template_language']);
        });
    }
};
