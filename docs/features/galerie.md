# Galerie (photos & vidéos)

**Statut :** ✅ Complet

## Vue d’ensemble

Gestion séparée des images et vidéos YouTube pour le site (bento / lightbox publics).

## Acteurs & rôles

Permissions `gallery_images.*` et `gallery_videos.*`.

## Fonctionnement

- Resources `gallery-images` et `gallery-videos`.
- Index avec `canCreate` / `can_update` / `can_delete`.
- Public : page galerie marketing.

## Fichiers clés

- `app/Http/Controllers/Admin/GalleryImageController.php`
- `app/Http/Controllers/Admin/GalleryVideoController.php`
- `app/Http/Controllers/Marketing/GalleryController.php`
- Policies `GalleryImagePolicy`, `GalleryVideoPolicy`
- `resources/js/pages/gallery-images/`, `gallery-videos/`
- `resources/js/pages/marketing/` (galerie)

## Limites & dette

- Deux features de permission distinctes (images vs vidéos).
