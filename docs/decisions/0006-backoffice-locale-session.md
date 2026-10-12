# ADR-0006 — Locale backoffice via session / cookie

**Statut :** Accepté  
**Date :** 2026-10-12

## Contexte

La phase 1 i18n ([ADR-0005](0005-i18n-public-url-prefix.md)) fixe la locale du site public par préfixe URL (`/en`). Le backoffice et les pages auth n’ont pas besoin d’URLs localisées (hors SEO) et ne doivent pas dépendre du cookie marketing `locale`.

## Décision

| Choix | Valeur |
|---|---|
| Périmètre | Backoffice, settings, pages Fortify auth |
| Stockage | Session `backoffice_locale` + cookie homonyme |
| Switcher | `PUT /backoffice/locale` (auth) — pas de préfixe `/en/dashboard` |
| Indépendance | Distinct du cookie `locale` marketing et de `SetLocaleFromUrl` |

## Conséquences

- `SetLocaleFromUrl` ignore les chemins backoffice/auth/settings.
- `SetBackofficeLocale` applique session/cookie sur ces chemins.
- Traductions UI admin dans `lang/{locale}/backoffice.json`, partagées Inertia uniquement sur cette surface.
- Toasts et messages de validation PHP via helper `bt()` (même catalogue JSON).
- Le site public reste piloté exclusivement par l’URL.
