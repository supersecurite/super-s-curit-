# Contribuer à Super Sécurité

Ce guide résume, pour un développeur humain, ce que [`AGENTS.md`](AGENTS.md) formalise pour les agents IA. En cas de doute, `AGENTS.md` et `.cursor/rules/` font référence.

## 1. Stack et prérequis

- **PHP 8.4+**, **Laravel 13**, **Composer 2**
- **Node.js 20+**, **npm**
- Base de données : MySQL / MariaDB (ou SQLite en tests)
- Serveur local : **Laravel Herd** (`super-securite.test`)

## 2. Installation locale

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
# ou: composer run dev
```

## 3. Commandes utiles

| Commande | Rôle |
|---|---|
| `php artisan test --compact` | Suite Pest |
| `php artisan test --compact --filter=…` | Filtre |
| `vendor/bin/pint --dirty` | Formatage PHP |
| `npm run build` / `npm run dev` | Frontend |
| `php artisan route:list` | Routes |

## 4. Workflow d’implémentation

1. Lire `docs/features/<module>.md` et `docs/ROADMAP.md`.
2. Vérifier les ADR dans `docs/decisions/` et les invariants `.cursor/rules/domain-invariants.mdc`.
3. Implémenter en **tranche verticale** (voir `.cursor/rules/feature-workflow.mdc`).
4. Documenter dans le code (`.cursor/rules/code-documentation.mdc`).
5. Mettre à jour la fiche feature + ROADMAP (+ ADR si besoin).
6. Lancer les tests Pest du périmètre + Pint.

## 5. Conventions

- **PHP** : Pint ; policies ; permissions `feature.action` ; Wayfinder côté front.
- **React / Inertia v3** : pages dans `resources/js/pages/` ; masquer les actions non autorisées.
- **Tracking** : ne jamais compter les pages backoffice (`VisitTracking`).
- **Rôles** : `UserRole` — ne pas ajouter de rôle sans ADR (ex. commercial = ADR-0001).

## 6. Documentation

| Document | Rôle |
|---|---|
| `docs/ROADMAP.md` | Priorités et statut modules |
| `docs/features/` | Comportement as-built |
| `docs/decisions/` | ADR |
| `AGENTS.md` | Hub agents + Boost |

## 7. Prochaine grande livraison produit

Marketing (clients, campagnes e-mail / WhatsApp Meta, accusés) — voir ROADMAP §4 et ADR-0001 / ADR-0002.
