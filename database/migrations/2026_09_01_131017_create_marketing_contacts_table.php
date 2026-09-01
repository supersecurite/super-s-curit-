<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_contacts', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 32)->nullable();
            $table->json('tags')->nullable();
            $table->boolean('marketing_consent')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique('email');
            $table->unique('phone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_contacts');
    }
};
