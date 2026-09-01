<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_message_templates', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('channel');
            $table->string('subject')->nullable();
            $table->text('body');
            $table->timestamps();
            $table->softDeletes();

            $table->index('channel');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_message_templates');
    }
};
