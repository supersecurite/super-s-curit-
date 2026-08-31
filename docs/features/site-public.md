# Site public marketing

**Statut :** ✅ Complet

## Vue d’ensemble

Site vitrine Super Sécurité : accueil, services, à propos, galerie, actualités, conseils, contact, devenir agent, légal / privacy.

## Acteurs & rôles

Visiteurs anonymes. Tracking visites actif (hors pages exclues).

## Fonctionnement

- Layout `marketing-layout` + `useVisitTracker`.
- Contenu dynamique : articles/conseils publiés, partenaires, galerie.
- Contact : `ContactController@store`.

## Fichiers clés

- `routes/web.php` (routes publiques)
- `app/Http/Controllers/Marketing/`
- `resources/js/pages/marketing/`
- `resources/js/layouts/marketing-layout.tsx`
- `resources/js/components/marketing/`

## Limites & dette

- SEO / sitemap / robots présents ; évolutions marketing content à documenter ici si structure change.
