# Utilisateurs & rôles

**Statut :** ✅ Complet

## Vue d’ensemble

Gestion des comptes backoffice : CRUD, rôles, permissions granulaires par feature/action. Édition en onglets URL (`?tab=profile|permissions|security`).

## Acteurs & rôles

| Rôle | Comportement |
|---|---|
| `super_admin` | Toutes permissions ; gère les autres super admins |
| `admin` | Permissions assignables (souvent toutes via seeder/factory) |
| `commercial` | Defaults marketing (`commercialDefaults()`) + dashboard — [ADR-0001](../decisions/0001-role-commercial.md) |
| `user` | Contributeur selon permissions |

Permissions `users.view|create|update|delete`.

`isAdmin()` = super_admin \| admin uniquement.

## Fonctionnement

- Index : boutons créer / éditer / supprimer selon `canCreate` / `can_update` / `can_delete`.
- Formulaire permissions : panneau groupé (recherche, tout activer, cartes par feature) — inclut `marketing_clients` et `marketing_campaigns`.
- Création / update d’un commercial **sans** permissions explicites → application de `BackofficePermission::commercialDefaults()`.
- Sync : `User::syncBackofficePermissions()`.
- Routes `users` en `uuid`.
- Seeder : compte `commercial@supersecurite.com` (env `SEED_COMMERCIAL_*`).

## Fichiers clés

- `app/Http/Controllers/UserController.php`
- `app/Enums/UserRole.php`, `BackofficePermission.php`
- `app/Models/User.php`, `UserBackofficePermission.php`
- `app/Policies/UserPolicy.php`
- `resources/js/pages/users/`
- `resources/js/components/users/user-form.tsx`, `user-permissions-panel.tsx`
- `tests/Feature/UserManagementTest.php`, `BackofficePermissionTest.php`

## Limites & dette

- Modules marketing (clients / campagnes) pas encore implémentés — les permissions existent déjà pour la Phase 2+.
- Un admin ne peut pas assigner `super_admin` (validation request).
