<?php

/**
 * Messages de validation contextualisés par entité / règle métier.
 *
 * Les clés suivent la convention attribute.rule de Laravel.
 */
return [
    'email' => [
        'unique' => 'Cette adresse e-mail est déjà utilisée.',
    ],
    'role' => [
        'in' => 'Ce rôle n\'est pas autorisé.',
        'required' => 'Le rôle est obligatoire.',
    ],
    'title' => [
        'required' => 'Le titre est obligatoire.',
    ],
    'name' => [
        'required' => 'Le nom est obligatoire.',
    ],
    'status' => [
        'required' => 'Le statut est obligatoire.',
        'in' => 'Ce statut n\'est pas autorisé.',
    ],
    'image' => [
        'image' => 'Le fichier doit être une image.',
        'max' => 'L\'image ne doit pas dépasser :max kilo-octets.',
    ],
    'logo' => [
        'required' => 'Le logo est obligatoire.',
        'image' => 'Le logo doit être une image.',
    ],
    'youtube_url' => [
        'required' => 'Le lien YouTube est obligatoire.',
    ],
    'phone' => [
        'required' => 'Le numéro de téléphone est obligatoire.',
        'unique' => 'Ce numéro de téléphone est déjà utilisé.',
        'regex' => 'Le téléphone doit être au format international (ex. +224612345678).',
    ],
    'message' => [
        'required' => 'Veuillez saisir un message.',
    ],
    'consent' => [
        'accepted' => 'Vous devez accepter le traitement de vos données.',
    ],
    'post' => [
        'required' => 'Le poste visé est obligatoire.',
    ],
    'alt' => [
        'required' => 'Le texte alternatif est obligatoire.',
    ],
    'g-recaptcha-response' => [
        'required' => 'La vérification anti-robot est requise.',
    ],
];
