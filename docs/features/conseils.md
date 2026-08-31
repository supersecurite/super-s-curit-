# Conseils de sécurité

**Statut :** ✅ Complet

## Vue d’ensemble

Même pattern que les actualités : CRUD, approbation, mise en avant, pages publiques.

## Acteurs & rôles

Permissions `conseils.*` (miroir des articles).

## Fonctionnement

- Backoffice : `conseils` resource (slug).
- Public : `/conseils-securite`, `/conseils-securite/{slug}`.

## Fichiers clés

- `app/Http/Controllers/Admin/SecurityTipController.php`
- `app/Http/Controllers/Marketing/SecurityTipController.php`
- `app/Policies/SecurityTipPolicy.php`
- `app/Models/SecurityTip.php`
- `resources/js/pages/conseils/`
- `resources/js/pages/marketing/conseils-securite/`

## Limites & dette

- Aligné sur le workflow articles ; toute évolution d’approbation doit rester cohérente entre les deux modules.
