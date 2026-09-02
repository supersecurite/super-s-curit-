<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Stocke une image de l'éditeur marketing et renvoie son URL publique.
 */
class StoreMarketingEditorImage extends Action
{
    /**
     * @return array{path: string, url: string}
     */
    public function handle(UploadedFile $file): array
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg');
        $filename = Str::uuid()->toString().'.'.$extension;
        $path = $file->storeAs('marketing/editor-images', $filename, 'public');

        return [
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ];
    }
}
