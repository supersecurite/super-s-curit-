<?php

test('pagination labels are translated in french', function () {
    app()->setLocale('fr');

    expect(__('pagination.previous'))->toBe('&laquo; Précédent')
        ->and(__('pagination.next'))->toBe('Suivant &raquo;');
});

test('validation messages use french defaults and attribute labels', function () {
    app()->setLocale('fr');

    expect(__('validation.required', ['attribute' => __('validation.attributes.email')]))
        ->toBe('Le champ adresse e-mail est obligatoire.')
        ->and(__('validation.unique', ['attribute' => __('validation.attributes.email')]))
        ->toBe('La valeur du champ adresse e-mail est déjà utilisée.');
});

test('validation custom messages are contextualized', function () {
    app()->setLocale('fr');

    expect(__('validation.custom.role.in'))
        ->toBe('Ce rôle n\'est pas autorisé.')
        ->and(__('validation.custom.image.image'))
        ->toBe('Le fichier doit être une image.');
});

test('auth and password reset messages are in french', function () {
    app()->setLocale('fr');

    expect(__('auth.failed'))
        ->toBe('Ces identifiants ne correspondent pas à nos enregistrements.')
        ->and(__('passwords.sent'))
        ->toBe('Nous vous avons envoyé le lien de réinitialisation par e-mail.');
});

test('json translation strings are in french', function () {
    app()->setLocale('fr');

    expect(__('Password updated.'))->toBe('Mot de passe mis à jour.');
});
