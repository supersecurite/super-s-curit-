# Paramètres compte

**Statut :** ✅ Complet

## Vue d’ensemble

Profil utilisateur connecté (nom, e-mail, téléphone) et sécurité (mot de passe, 2FA selon Fortify).

## Acteurs & rôles

Tout utilisateur authentifié (pas de permission backoffice dédiée).

## Fonctionnement

- Routes `settings/profile`, `settings/security`.
- Exclues du tracking (`settings` prefix).

## Fichiers clés

- `routes/settings.php`
- `app/Http/Controllers/Settings/ProfileController.php`
- `app/Http/Controllers/Settings/SecurityController.php`
- `resources/js/pages/settings/`

## Limites & dette

- Aucune connue de premier ordre.
