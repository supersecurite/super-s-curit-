<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->string('name')->nullable()->after('uuid');
        });

        DB::table('marketing_contacts')->orderBy('id')->each(function (object $row): void {
            $name = trim(($row->first_name ?? '').' '.($row->last_name ?? ''));

            DB::table('marketing_contacts')->where('id', $row->id)->update([
                'name' => $name !== '' ? $name : null,
            ]);
        });

        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'last_name', 'company_role']);
        });
    }

    public function down(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('uuid');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('company_role')->nullable()->after('company_name');
        });

        DB::table('marketing_contacts')->orderBy('id')->each(function (object $row): void {
            $parts = preg_split('/\s+/', trim((string) ($row->name ?? '')), 2) ?: [];

            DB::table('marketing_contacts')->where('id', $row->id)->update([
                'first_name' => $parts[0] ?? null,
                'last_name' => $parts[1] ?? null,
            ]);
        });

        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }
};
