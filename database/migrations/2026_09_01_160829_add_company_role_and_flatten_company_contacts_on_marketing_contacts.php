<?php

use App\Models\MarketingContact;
use App\Support\Marketing\MarketingCompanyContactRules;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->string('company_role')->nullable()->after('company_name');
        });

        MarketingContact::query()
            ->whereNotNull('company_contacts')
            ->eachById(function (MarketingContact $contact): void {
                $raw = $contact->company_contacts;

                if (! is_array($raw)) {
                    return;
                }

                $legacyRole = MarketingCompanyContactRules::extractLegacyRole($raw);
                $flatChannels = MarketingCompanyContactRules::normalize($raw);

                $contact->forceFill([
                    'company_role' => $contact->company_role ?? $legacyRole,
                    'company_contacts' => $flatChannels === [] ? null : $flatChannels,
                ])->saveQuietly();
            });
    }

    public function down(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->dropColumn('company_role');
        });
    }
};
