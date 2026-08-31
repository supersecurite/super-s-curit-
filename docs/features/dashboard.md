# Dashboard

**Statut :** ✅ Complet

## Vue d’ensemble

Tableau de bord post-login. Vue admin (stats globales, candidatures, trafic) vs vue contributeur (ses contenus), filtrée par permissions côté UI.

## Acteurs & rôles

Utilisateurs avec `dashboard.view` (et permissions des modules liés pour les liens / cartes).

## Fonctionnement

- `DashboardController` agrège stats articles, conseils, candidatures, visites.
- UI : `resources/js/pages/dashboard.tsx` + `useBackofficePermission` pour masquer les blocs non autorisés.

## Fichiers clés

- `app/Http/Controllers/DashboardController.php`
- `resources/js/pages/dashboard.tsx`
- `resources/js/hooks/use-backoffice-permission.ts`
- Route : `dashboard` + middleware `backoffice.permission:dashboard`

## Limites & dette

- Les stats affichées peuvent mentionner des modules que l’utilisateur ne peut pas ouvrir si les permissions sont partielles (liens filtrés, compteurs selon vue admin/user).
