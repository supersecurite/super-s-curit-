<?php

use App\Models\MarketingContact;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->boolean('is_company')->default(false)->after('phone');
        });

        MarketingContact::query()
            ->where(function ($query): void {
                $query
                    ->whereNotNull('company_name')
                    ->orWhereNotNull('company_role')
                    ->orWhereNotNull('company_contacts');
            })
            ->eachById(function (MarketingContact $contact): void {
                $contact->forceFill(['is_company' => true])->saveQuietly();
            });
    }

    public function down(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->dropColumn('is_company');
        });
    }
};
