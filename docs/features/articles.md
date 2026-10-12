# Actualités (articles)

**Statut :** ✅ Complet

## Vue d’ensemble

CRUD backoffice des actualités avec workflow d’approbation, mise à la une, et affichage public des articles publiés.

## Acteurs & rôles

Permissions `articles.*` (view, create, update, update_any, delete, delete_any, approve, feature).

## Fonctionnement

- Liste avec onglets / filtres ; boutons conditionnés par `canCreate` / `can_update` / `can_delete`.
- Création → statut en attente ; approbation / publication réservée à `articles.approve`.
- Feature (une) : `articles.feature`.
- Public : `/actualites`, `/actualites/{slug}` (+ `/en/...` avec contenu localisé).
- Champs EN optionnels : `title_en`, `excerpt_en`, `content_en` — fallback FR si absents ; bandeau CMS seulement en fallback.
- Mutations create/update via `app/Actions/Articles/`.
- Sitemap `/en/actualites/{slug}` uniquement si `title_en` renseigné.

## Fichiers clés

- `app/Http/Controllers/Admin/ArticleController.php`
- `app/Http/Controllers/Marketing/ArticleController.php`
- `app/Actions/Articles/`
- `app/Support/LocalizedCmsContent.php`
- `app/Policies/ArticlePolicy.php`
- `app/Models/Article.php`
- `resources/js/pages/articles/`
- `resources/js/pages/marketing/articles/`

## Limites & dette

- Limite de featured gérée côté contrôleur.
- Pas de `slug_en` (même slug FR sous `/en`).
