<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_contact_marketing_list', function (Blueprint $table) {
            $table->id();
            $table->foreignId('marketing_contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('marketing_list_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['marketing_contact_id', 'marketing_list_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_contact_marketing_list');
    }
};
