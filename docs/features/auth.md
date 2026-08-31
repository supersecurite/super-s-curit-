# Authentification

**Statut :** ✅ Complet

## Vue d’ensemble

Authentification via Laravel Fortify (login, register selon config, reset password, vérification e-mail, 2FA).

## Acteurs & rôles

Tout utilisateur avec compte. Accès backoffice conditionné ensuite par permissions.

## Fonctionnement

- Routes Fortify standard ; pages Inertia sous `resources/js/pages/auth/`.
- 2FA et confirmation mot de passe gérés via Fortify / settings sécurité.
- Pages auth exclues du tracking visites.

## Fichiers clés

- `app/Providers/` (Fortify)
- `resources/js/pages/auth/`
- `resources/js/pages/settings/security*`
- Tests : `tests/Feature/` (auth / settings)

## Limites & dette

- Pas de passkey documenté comme prioritaire (contrairement à d’autres apps).
