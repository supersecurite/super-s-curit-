<?php

use App\Mail\ContactMessageMailable;
use App\Support\Mail\EmailBranding;

test('email branding builds legal footer from config', function () {
    config([
        'super-securite.company_legal_name' => 'Super Sécurité sarl',
        'super-securite.share_capital' => '10 000 000 GNF',
        'super-securite.rccm' => 'GN.TCC.2022.14296',
        'super-securite.phone' => '+224 612 13 13 14',
        'super-securite.phone_secondary' => '+224 612 13 13 15',
        'super-securite.email' => 'contact@supersecurite.com',
        'super-securite.website' => 'www.supersecurite.com',
        'super-securite.mail.address_short' => 'Lambanyi (en face CIS Média)',
        'super-securite.mail.legal_footer' => null,
    ]);

    $footer = EmailBranding::legalFooterText();

    expect($footer)
        ->toContain('Super Sécurité sarl')
        ->toContain('10 000 000 GNF')
        ->toContain('GN.TCC.2022.14296')
        ->toContain('contact@supersecurite.com')
        ->toContain('www.supersecurite.com')
        ->toContain('Lambanyi (en face CIS Média)');
});

test('email branding legal footer can be overridden via env config', function () {
    config([
        'super-securite.mail.legal_footer' => 'Mention légale personnalisée.',
    ]);

    expect(EmailBranding::legalFooterText())->toBe('Mention légale personnalisée.');
});

test('transactional email layout renders header and footer branding', function () {
    config([
        'app.name' => 'Super Sécurité',
        'app.url' => 'https://supersecurite.test',
        'super-securite.email' => 'contact@supersecurite.com',
        'super-securite.phone' => '+224 612 13 13 14',
        'super-securite.phone_secondary' => '+224 612 13 13 15',
        'super-securite.mail.address_short' => 'Lambanyi (en face CIS Média)',
        'super-securite.company_legal_name' => 'Super Sécurité sarl',
        'super-securite.share_capital' => '10 000 000 GNF',
        'super-securite.rccm' => 'GN.TCC.2022.14296',
        'super-securite.website' => 'www.supersecurite.com',
        'super-securite.website_url' => 'https://www.supersecurite.com',
    ]);

    $html = view('emails.welcome-set-password', [
        'branding' => EmailBranding::data(),
        'name' => 'Jean Dupont',
        'appName' => 'Super Sécurité',
        'url' => 'https://supersecurite.test/reset-password/example',
        'minutes' => 15,
    ])->render();

    expect($html)
        ->toContain('logo-white.jpeg')
        ->toContain('Tél&nbsp;: +224 612 13 13 14 / +224 612 13 13 15')
        ->toContain('contact@supersecurite.com')
        ->toContain('Lambanyi (en face CIS Média)')
        ->toContain('Super Sécurité sarl')
        ->toContain('Choisir mon mot de passe');
});

test('contact message mailable uses branded html template', function () {
    config([
        'app.url' => 'https://supersecurite.test',
        'super-securite.email' => 'contact@supersecurite.com',
    ]);

    $mailable = new ContactMessageMailable([
        'name' => 'Client Test',
        'email' => 'client@example.com',
        'phone' => '+224 600 00 00 00',
        'message' => 'Bonjour, je souhaite un devis.',
    ]);

    $html = $mailable->render();

    expect($html)
        ->toContain('Nouveau message de contact')
        ->toContain('Client Test')
        ->toContain('contact@supersecurite.com');
});
