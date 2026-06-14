<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class Recaptcha implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! config('recaptcha.enabled')) {
            return;
        }

        if (! is_string($value) || $value === '') {
            $fail('Veuillez confirmer que vous n\'êtes pas un robot.');

            return;
        }

        $secretKey = config('recaptcha.secret_key');

        if (! is_string($secretKey) || $secretKey === '') {
            $fail('La vérification anti-robot est indisponible. Réessayez plus tard.');

            return;
        }

        $response = Http::asForm()
            ->timeout(10)
            ->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretKey,
                'response' => $value,
                'remoteip' => request()->ip(),
            ]);

        if (! $response->successful() || ! $response->json('success')) {
            $fail('La vérification reCAPTCHA a échoué. Veuillez réessayer.');
        }
    }
}
