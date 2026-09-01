<?php

namespace App\DataTransferObjects;

class MarketingContactImportResult
{
    /**
     * @param  list<array{row: int, message: string}>  $errors
     * @param  list<array{row: int, email: ?string, phone: ?string}>  $duplicates
     */
    public function __construct(
        public int $added = 0,
        public int $skipped = 0,
        public array $errors = [],
        public array $duplicates = [],
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'added' => $this->added,
            'skipped' => $this->skipped,
            'errors' => $this->errors,
            'duplicates' => $this->duplicates,
            'errors_count' => count($this->errors),
            'duplicates_count' => count($this->duplicates),
        ];
    }
}
