<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Mail\ContactMessageMailable;
use App\Support\LocaleTranslations;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Mail::to(config('super-securite.mail_to'))->send(
            new ContactMessageMailable($validated),
        );

        return back()->with('success', LocaleTranslations::trans('public_content.contact_success'));
    }
}
