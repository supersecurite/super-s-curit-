<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Backoffice\UpdateBackofficeLocale;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateBackofficeLocaleRequest;
use Illuminate\Http\RedirectResponse;

class BackofficeLocaleController extends Controller
{
    public function update(
        UpdateBackofficeLocaleRequest $request,
        UpdateBackofficeLocale $action,
    ): RedirectResponse {
        $locale = (string) $request->validated('locale');
        $cookie = $action->handle($request, $locale);

        return back()->withCookie($cookie);
    }
}
