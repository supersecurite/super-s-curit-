<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Enums\MarketingMessageTemplateChannel;
use App\Models\MarketingMessageTemplate;
use App\Models\WhatsAppAccount;
use App\Services\Marketing\WhatsAppCloudApiService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Soumet un modèle de message à Meta Cloud API et l'enregistre localement.
 */
class SubmitWhatsAppMetaTemplate extends Action
{
    public function __construct(
        protected WhatsAppCloudApiService $apiService,
    ) {}

    /**
     * @param  array{
     *     account_uuid?: string|null,
     *     name: string,
     *     title?: string|null,
     *     category?: string|null,
     *     language?: string|null,
     *     header_text?: string|null,
     *     body_text: string,
     *     footer_text?: string|null,
     *     example_values?: list<string>
     * }  $data
     */
    public function handle(array $data): MarketingMessageTemplate
    {
        $accountUuid = $data['account_uuid'] ?? null;

        $account = $accountUuid !== null && $accountUuid !== ''
            ? WhatsAppAccount::query()->where('uuid', $accountUuid)->where('is_active', true)->first()
            : WhatsAppAccount::query()->where('is_active', true)->orderByDesc('is_default')->first();

        if ($account === null) {
            throw new RuntimeException('Aucun compte WhatsApp actif configuré pour soumettre ce modèle.');
        }

        $metaName = Str::slug($data['name'], '_');
        $language = trim($data['language'] ?? 'fr');
        $category = strtoupper(trim($data['category'] ?? 'MARKETING'));
        $title = filled($data['title'] ?? null)
            ? trim((string) $data['title'])
            : ucwords(str_replace(['_', '-'], ' ', $metaName));

        $headerText = filled($data['header_text'] ?? null) ? trim((string) $data['header_text']) : null;
        $bodyText = trim($data['body_text']);
        $footerText = filled($data['footer_text'] ?? null) ? trim((string) $data['footer_text']) : null;

        // Soumission Meta
        $this->apiService->createTemplate($account, [
            'name' => $metaName,
            'language' => $language,
            'category' => $category,
            'body_text' => $bodyText,
            'header_text' => $headerText,
            'footer_text' => $footerText,
            'example_values' => $data['example_values'] ?? [],
        ]);

        // Enregistrement local
        return DB::transaction(function () use ($metaName, $language, $title, $bodyText, $headerText): MarketingMessageTemplate {
            return MarketingMessageTemplate::query()->updateOrCreate(
                [
                    'channel' => MarketingMessageTemplateChannel::WhatsApp,
                    'meta_template_name' => $metaName,
                    'meta_template_language' => $language,
                ],
                [
                    'name' => $title,
                    'body' => $bodyText,
                    'subject' => $headerText,
                ],
            );
        });
    }
}
