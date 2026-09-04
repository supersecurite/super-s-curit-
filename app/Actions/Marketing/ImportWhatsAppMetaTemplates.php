<?php

namespace App\Actions\Marketing;

use App\Enums\MarketingMessageTemplateChannel;
use App\Models\MarketingMessageTemplate;
use Illuminate\Support\Facades\DB;

/**
 * Importe ou met à jour les modèles de messages Meta WhatsApp sélectionnés.
 */
class ImportWhatsAppMetaTemplates
{
    /**
     * @param  list<array{
     *     name: string,
     *     language: string,
     *     body_text?: string|null,
     *     header_text?: string|null,
     *     title?: string|null
     * }>  $templates
     * @return int Nombre de templates créés ou mis à jour
     */
    public function handle(array $templates): int
    {
        return DB::transaction(function () use ($templates): int {
            $count = 0;

            foreach ($templates as $item) {
                $metaName = trim($item['name'] ?? '');
                $language = trim($item['language'] ?? 'fr');

                if ($metaName === '') {
                    continue;
                }

                $title = filled($item['title'] ?? null)
                    ? trim((string) $item['title'])
                    : ucwords(str_replace(['_', '-'], ' ', $metaName));

                $bodyText = (string) ($item['body_text'] ?? '');
                $headerText = isset($item['header_text']) && filled($item['header_text'])
                    ? (string) $item['header_text']
                    : null;

                MarketingMessageTemplate::query()->updateOrCreate(
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

                $count++;
            }

            return $count;
        });
    }
}
