# Partenaires

**Statut :** ✅ Complet

## Vue d’ensemble

CRUD des partenaires affichés sur la page d’accueil (marquee / logos).

## Acteurs & rôles

Permissions `partners.*`.

## Fonctionnement

- Resource `partners` (uuid).
- Public : chargés sur `home` via `Partner::published()`.

## Fichiers clés

- `app/Http/Controllers/Admin/PartnerController.php`
- `app/Models/Partner.php`
- `app/Policies/PartnerPolicy.php`
- `resources/js/pages/partners/`

## Limites & dette

- Aucune connue de premier ordre.
