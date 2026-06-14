<?php

namespace App\Support;

class SeedLexicalContent
{
    /**
     * @param  list<string>  $paragraphs
     */
    public static function fromParagraphs(array $paragraphs): string
    {
        $children = array_map(
            fn (string $paragraph): array => [
                'type' => 'paragraph',
                'children' => [
                    [
                        'type' => 'text',
                        'text' => $paragraph,
                    ],
                ],
            ],
            $paragraphs,
        );

        return json_encode(
            [
                'root' => [
                    'type' => 'root',
                    'children' => $children,
                ],
            ],
            JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR,
        );
    }
}
