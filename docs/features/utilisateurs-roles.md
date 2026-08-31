# Utilisateurs & rôles

**Statut :** ✅ Complet (rôle `commercial` prévu — 🔲)

## Vue d’ensemble

Gestion des comptes backoffice : CRUD, rôles, permissions granulaires par feature/action. Édition en onglets URL (`?tab=profile|permissions|security`).

## Acteurs & rôles

| Rôle | Comportement actuel |
|---|---|
| `super_admin` | Toutes permissions ; gère les autres super admins |
| `admin` | Permissions assignables (souvent toutes via seeder/factory) |
| `user` | Contributeur selon permissions |
| `commercial` | **Non implémenté** — [ADR-0001](../decisions/0001-role-commercial.md) |

Permissions `users.view|create|update|delete`.

## Fonctionnement

- Index : boutons créer / éditer / supprimer selon `canCreate` / `can_update` / `can_delete`.
- Formulaire permissions : panneau groupé (recherche, tout activer, cartes par feature).
- Sync : `User::syncBackofficePermissions()`.
- Routes `users` en `uuid`.

## Fichiers clés

- `app/Http/Controllers/UserController.php`
- `app/Enums/UserRole.php`, `BackofficePermission.php`
- `app/Models/User.php`, `UserBackofficePermission.php`
- `app/Policies/UserPolicy.php`
- `resources/js/pages/users/`
- `resources/js/components/users/user-form.tsx`, `user-permissions-panel.tsx`
- `tests/Feature/UserManagementTest.php`, `BackofficePermissionTest.php`

## Limites & dette

- Rôle commercial à ajouter (ADR-0001) sans casser les policies existantes.
- Un admin ne peut pas assigner `super_admin` (validation request).
