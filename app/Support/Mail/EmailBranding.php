<?php

namespace App\Support\Mail;

/**
 * Données de marque partagées par tous les e-mails transactionnels.
 *
 * Source : `config/super-securite.php` (variables `.env` SUPER_SECURITE_*).
 */
final class EmailBranding
{
    /**
     * @return array<string, mixed>
     */
    public static function data(): array
    {
        $websiteUrl = (string) config('super-securite.website_url');
        $websiteLabel = (string) config('super-securite.website');

        return [
            'app_name' => (string) config('app.name'),
            'company_legal_name' => (string) config('super-securite.company_legal_name'),
            'share_capital' => (string) config('super-securite.share_capital'),
            'rccm' => config('super-securite.rccm'),
            'email' => (string) config('super-securite.email'),
            'phone' => (string) config('super-securite.phone'),
            'phone_secondary' => config('super-securite.phone_secondary'),
            'phone_display' => self::phoneDisplay(),
            'address' => (string) config('super-securite.address'),
            'address_short' => (string) (config('super-securite.mail.address_short') ?: config('super-securite.address')),
            'website' => $websiteLabel,
            'website_url' => $websiteUrl !== '' ? $websiteUrl : 'https://'.$websiteLabel,
            'logo_url' => self::logoUrl(),
            'header_bg' => (string) config('super-securite.mail.header_bg', '#c4161d'),
            'footer_bg' => (string) config('super-securite.mail.footer_bg', '#7a0e14'),
            'accent_color' => (string) config('super-securite.mail.accent_color', '#ed1c24'),
            'header_text' => '#ffffff',
            'header_muted' => '#fecaca',
            'footer_text' => '#fecaca',
            'legal_footer' => self::legalFooterText(),
        ];
    }

    public static function phoneDisplay(): string
    {
        $primary = trim((string) config('super-securite.phone'));
        $secondary = trim((string) config('super-securite.phone_secondary', ''));

        if ($primary === '') {
            return $secondary;
        }

        if ($secondary === '') {
            return $primary;
        }

        return "{$primary} / {$secondary}";
    }

    public static function logoUrl(): string
    {
        $configured = trim((string) config('super-securite.mail.logo_url', ''));

        if ($configured !== '') {
            return $configured;
        }

        return rtrim((string) config('app.url'), '/').'/logo-white.jpeg';
    }

    public static function legalFooterText(): string
    {
        $override = trim((string) config('super-securite.mail.legal_footer', ''));

        if ($override !== '') {
            return $override;
        }

        $segments = [];

        $company = trim((string) config('super-securite.company_legal_name'));
        $capital = trim((string) config('super-securite.share_capital'));

        if ($company !== '' && $capital !== '') {
            $segments[] = "{$company} au capital social de {$capital}";
        } elseif ($company !== '') {
            $segments[] = $company;
        }

        $rccm = trim((string) config('super-securite.rccm', ''));

        if ($rccm !== '') {
            $segments[] = "immatriculée au registre sous le numéro RCCM {$rccm}";
        }

        $text = implode(' ', $segments);

        if ($text !== '') {
            $text .= '.';
        }

        $phoneDisplay = self::phoneDisplay();

        if ($phoneDisplay !== '') {
            $text .= " Tél : {$phoneDisplay}.";
        }

        $email = trim((string) config('super-securite.email'));

        if ($email !== '') {
            $text .= " E-mail : {$email}.";
        }

        $website = trim((string) config('super-securite.website'));

        if ($website !== '') {
            $text .= " Site internet : {$website}.";
        }

        $address = trim((string) (config('super-securite.mail.address_short') ?: config('super-securite.address')));

        if ($address !== '') {
            $text .= " Adresse : {$address}.";
        }

        return trim($text);
    }
}
