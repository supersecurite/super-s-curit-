# Conseils de sécurité

**Statut :** ✅ Complet

## Vue d’ensemble

Même pattern que les actualités : CRUD, approbation, mise en avant, pages publiques.

## Acteurs & rôles

Permissions `conseils.*` (miroir des articles).

## Fonctionnement

- Backoffice : `conseils` resource (slug) ; champs EN optionnels (`title_en`, `excerpt_en`, `content_en`).
- Public : `/conseils-securite`, `/conseils-securite/{slug}` (+ `/en/...` localisé, fallback FR).
- Mutations create/update via `app/Actions/SecurityTips/`.

## Fichiers clés

- `app/Http/Controllers/Admin/SecurityTipController.php`
- `app/Http/Controllers/Marketing/SecurityTipController.php`
- `app/Actions/SecurityTips/`
- `app/Support/LocalizedCmsContent.php`
- `app/Policies/SecurityTipPolicy.php`
- `app/Models/SecurityTip.php`
- `resources/js/pages/conseils/`
- `resources/js/pages/marketing/conseils-securite/`

## Limites & dette

- Aligné sur le workflow articles ; toute évolution d’approbation doit rester cohérente entre les deux modules.
- Pas de `slug_en`.
