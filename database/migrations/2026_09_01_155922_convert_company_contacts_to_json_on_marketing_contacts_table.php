<?php

use App\Models\MarketingContact;
use App\Support\Marketing\CompanyContactLegacyConverter;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        MarketingContact::query()
            ->whereNotNull('company_contacts')
            ->eachById(function (MarketingContact $contact): void {
                $raw = $contact->getRawOriginal('company_contacts');

                if ($raw === null || $raw === '') {
                    $contact->forceFill(['company_contacts' => null])->saveQuietly();

                    return;
                }

                if (is_string($raw)) {
                    $decoded = json_decode($raw, true);

                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        return;
                    }

                    $contact->forceFill([
                        'company_contacts' => CompanyContactLegacyConverter::convert($raw),
                    ])->saveQuietly();
                }
            });

        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->json('company_contacts')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('marketing_contacts', function (Blueprint $table) {
            $table->text('company_contacts')->nullable()->change();
        });
    }
};
