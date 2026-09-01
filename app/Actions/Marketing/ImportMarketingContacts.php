<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\DataTransferObjects\MarketingContactImportResult;
use App\Services\Marketing\MarketingContactImportService;
use Illuminate\Http\UploadedFile;

/**
 * Importe des contacts depuis un fichier CSV et retourne un rapport détaillé.
 */
class ImportMarketingContacts extends Action
{
    public function __construct(
        private MarketingContactImportService $importService,
    ) {}

    public function handle(UploadedFile $file): MarketingContactImportResult
    {
        return $this->importService->import($file);
    }
}
