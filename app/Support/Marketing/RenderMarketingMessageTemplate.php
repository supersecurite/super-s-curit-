<?php

namespace App\Support\Marketing;

use App\Models\MarketingContact;

/**
 * Remplace les variables dynamiques {{…}} dans un modèle de message.
 */
final class RenderMarketingMessageTemplate
{
    /** @var list<string> */
    public const VARIABLES = [
        'prenom',
        'nom',
        'email',
        'telephone',
        'entreprise',
        'role_entreprise',
        'adresse',
    ];

    public static function render(string $content, MarketingContact $contact): string
    {
        return self::replacePlainVariables(self::extractPlainText($content), $contact);
    }

    public static function renderHtml(string $content, MarketingContact $contact): string
    {
        return self::replaceHtmlVariables(self::renderLexicalHtml($content), $contact);
    }

    /**
     * @return array<string, string>
     */
    private static function plainVariableReplacements(MarketingContact $contact): array
    {
        return [
            '{{prenom}}' => $contact->first_name ?? '',
            '{{nom}}' => $contact->last_name ?? '',
            '{{email}}' => $contact->email ?? '',
            '{{telephone}}' => $contact->phone ?? '',
            '{{entreprise}}' => $contact->company_name ?? '',
            '{{role_entreprise}}' => $contact->company_role ?? '',
            '{{adresse}}' => $contact->address ?? '',
        ];
    }

    /**
     * @return array<string, string>
     */
    private static function htmlVariableReplacements(MarketingContact $contact): array
    {
        return [
            '{{prenom}}' => e($contact->first_name ?? ''),
            '{{nom}}' => e($contact->last_name ?? ''),
            '{{email}}' => e($contact->email ?? ''),
            '{{telephone}}' => e($contact->phone ?? ''),
            '{{entreprise}}' => e($contact->company_name ?? ''),
            '{{role_entreprise}}' => e($contact->company_role ?? ''),
            '{{adresse}}' => e($contact->address ?? ''),
        ];
    }

    private static function replacePlainVariables(string $content, MarketingContact $contact): string
    {
        return str_replace(
            array_keys(self::plainVariableReplacements($contact)),
            array_values(self::plainVariableReplacements($contact)),
            $content,
        );
    }

    private static function replaceHtmlVariables(string $content, MarketingContact $contact): string
    {
        return str_replace(
            array_keys(self::htmlVariableReplacements($contact)),
            array_values(self::htmlVariableReplacements($contact)),
            $content,
        );
    }

    private static function renderLexicalHtml(string $content): string
    {
        $trimmed = trim($content);

        if ($trimmed === '') {
            return '';
        }

        try {
            $decoded = json_decode($trimmed, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return self::plainTextToHtml($content);
        }

        if (! is_array($decoded) || ! isset($decoded['root']['children']) || ! is_array($decoded['root']['children'])) {
            return self::plainTextToHtml($content);
        }

        return self::walkLexicalHtmlNodes($decoded['root']['children']);
    }

    private static function plainTextToHtml(string $content): string
    {
        $paragraphs = preg_split("/\r\n|\r|\n/", trim($content)) ?: [];

        return collect($paragraphs)
            ->filter(fn (string $paragraph): bool => trim($paragraph) !== '')
            ->map(fn (string $paragraph): string => '<p>'.e($paragraph).'</p>')
            ->implode('');
    }

    /**
     * Extrait le texte brut d'un contenu Lexical JSON ou renvoie le texte legacy tel quel.
     */
    public static function extractPlainText(string $content): string
    {
        $trimmed = trim($content);

        if ($trimmed === '') {
            return '';
        }

        try {
            $decoded = json_decode($trimmed, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return $content;
        }

        if (! is_array($decoded) || ! isset($decoded['root']['children']) || ! is_array($decoded['root']['children'])) {
            return $content;
        }

        return self::walkLexicalNodes($decoded['root']['children']);
    }

    /**
     * @param  array<int, mixed>  $nodes
     */
    private static function walkLexicalNodes(array $nodes): string
    {
        $parts = [];

        foreach ($nodes as $node) {
            if (! is_array($node)) {
                continue;
            }

            $type = (string) ($node['type'] ?? '');

            if ($type === 'text' || $type === 'template-variable') {
                $parts[] = (string) ($node['text'] ?? '');

                continue;
            }

            if (isset($node['children']) && is_array($node['children'])) {
                $parts[] = self::walkLexicalNodes($node['children']);

                if (in_array($type, ['paragraph', 'heading', 'listitem', 'quote'], true)) {
                    $parts[] = "\n";
                }
            }
        }

        return rtrim(implode('', $parts));
    }

    /**
     * @param  array<int, mixed>  $nodes
     */
    private static function walkLexicalHtmlNodes(array $nodes): string
    {
        $parts = [];

        foreach ($nodes as $node) {
            if (! is_array($node)) {
                continue;
            }

            $type = (string) ($node['type'] ?? '');

            if ($type === 'text') {
                $parts[] = e((string) ($node['text'] ?? ''));

                continue;
            }

            if ($type === 'template-variable') {
                $parts[] = e((string) ($node['text'] ?? ''));

                continue;
            }

            if (! isset($node['children']) || ! is_array($node['children'])) {
                continue;
            }

            $inner = self::walkLexicalHtmlNodes($node['children']);

            $parts[] = match ($type) {
                'heading' => self::wrapHeading($inner, (string) ($node['tag'] ?? 'h2')),
                'quote' => '<blockquote>'.$inner.'</blockquote>',
                'list' => ($node['listType'] ?? 'bullet') === 'number'
                    ? '<ol>'.$inner.'</ol>'
                    : '<ul>'.$inner.'</ul>',
                'listitem' => '<li>'.$inner.'</li>',
                default => '<p>'.$inner.'</p>',
            };
        }

        return implode('', $parts);
    }

    private static function wrapHeading(string $inner, string $tag): string
    {
        $allowed = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        if (! in_array($tag, $allowed, true)) {
            $tag = 'h2';
        }

        return "<{$tag}>{$inner}</{$tag}>";
    }
}
