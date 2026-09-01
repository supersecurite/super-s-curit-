<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('access_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('kind', 16)->default('visit');
            $table->string('http_method', 10)->nullable();
            $table->string('route_name', 150)->nullable();
            $table->string('ip', 45);
            $table->string('user_agent', 512)->nullable();
            $table->string('page', 2048);
            $table->string('description', 512)->nullable();
            $table->timestamp('visited_at');
            $table->timestamps();
            $table->softDeletes();

            $table->index('visited_at');
            $table->index('user_id');
            $table->index('kind');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('access_logs');
    }
};
