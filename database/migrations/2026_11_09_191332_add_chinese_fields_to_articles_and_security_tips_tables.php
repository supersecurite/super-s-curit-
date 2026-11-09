<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('title_zh')->nullable()->after('title_en');
            $table->text('excerpt_zh')->nullable()->after('excerpt_en');
            $table->longText('content_zh')->nullable()->after('content_en');
        });

        Schema::table('security_tips', function (Blueprint $table) {
            $table->string('title_zh')->nullable()->after('title_en');
            $table->text('excerpt_zh')->nullable()->after('excerpt_en');
            $table->longText('content_zh')->nullable()->after('content_en');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['title_zh', 'excerpt_zh', 'content_zh']);
        });

        Schema::table('security_tips', function (Blueprint $table) {
            $table->dropColumn(['title_zh', 'excerpt_zh', 'content_zh']);
        });
    }
};
