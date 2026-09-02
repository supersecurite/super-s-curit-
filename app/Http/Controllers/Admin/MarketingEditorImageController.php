<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\StoreMarketingEditorImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketingEditorImageRequest;
use Illuminate\Http\JsonResponse;

class MarketingEditorImageController extends Controller
{
    /**
     * Upload une image pour l'éditeur de templates / campagnes e-mail.
     */
    public function store(
        StoreMarketingEditorImageRequest $request,
        StoreMarketingEditorImage $action,
    ): JsonResponse {
        $stored = $action->handle($request->file('image'));

        return response()->json([
            'url' => url($stored['url']),
            'path' => $stored['path'],
        ]);
    }
}
