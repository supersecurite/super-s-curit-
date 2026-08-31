# ADR-0001 : Introduction du rôle `commercial`

## Status

Accepted

## Date

2026-08-31

## Context

Super Sécurité dispose de trois rôles (`super_admin`, `admin`, `user`). Un besoin métier apparaît : des utilisateurs dédiés au marketing (clients, campagnes e-mail / WhatsApp) sans leur donner le périmètre admin contenu / RH / analytics complet.

## Decision

1. Ajouter `UserRole::Commercial = 'commercial'` avec label « Commercial ».
2. Ce rôle n’implique **aucune** permission implicite (contrairement à `super_admin`).
3. Permissions par défaut à la création / seeder : ensemble `marketing.*` (noms exacts définis à l’implémentation dans `BackofficePermission`) + éventuellement `dashboard.view`.
4. Assignable / modifiable par `admin` et `super_admin` (même règles que pour `user` / `admin` — un non–super_admin ne peut pas créer de `super_admin`).
5. `isAdmin()` reste `super_admin || admin` — le commercial n’est **pas** un admin.
6. Mettre à jour policies, formulaires utilisateurs, seeder, factory, tests, et `docs/features/utilisateurs-roles.md`.

## Alternatives Considered

### Réutiliser `user` avec seulement des permissions marketing
- Pros : pas de nouveau rôle
- Cons : confond contributeur contenu et commercial ; UX et reporting flous
- Rejected because : le métier veut un rôle distinct identifiable

### Faire du commercial un sous-type d’admin
- Pros : accès large
- Cons : trop de pouvoir ; viole le principe du moindre privilège
- Rejected because : le commercial ne doit pas gérer articles / users / etc. par défaut

## Consequences

- Toucher `UserRole`, validation des Form Requests, UI select rôles, badges.
- Nouvelles permissions marketing à ajouter avant ou avec ce rôle.
- Dashboard commercial : probablement réduit aux modules marketing (+ dashboard) une fois livrés.
