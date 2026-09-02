<?php

namespace App\Support;

/**
 * Normalise et valide les numéros de téléphone internationaux (E.164).
 *
 * Accepte la saisie avec espaces, tirets, parenthèses, etc. — ex. +1 (555) 670-8636.
 */
final class InternationalPhoneNumber
{
    /**
     * Normalise vers E.164 ou retourne null si le numéro est vide ou invalide.
     */
    public static function normalize(?string $phone): ?string
    {
        if ($phone === null) {
            return null;
        }

        $trimmed = trim($phone);

        if ($trimmed === '') {
            return null;
        }

        if (! str_contains($trimmed, '+')) {
            return null;
        }

        $digits = preg_replace('/\D/', '', $trimmed) ?? '';

        // Au moins 8 chiffres au total (indicatif + numéro) — évite de stocker un simple +224.
        if (strlen($digits) < 8) {
            return null;
        }

        $e164 = '+'.$digits;

        if (! self::isValidE164($e164)) {
            return null;
        }

        return $e164;
    }

    public static function isValid(?string $phone): bool
    {
        return self::normalize($phone) !== null;
    }

    private static function isValidE164(string $phone): bool
    {
        return (bool) preg_match('/^\+[1-9]\d{1,14}$/', $phone);
    }
}
