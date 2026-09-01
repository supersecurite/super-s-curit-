# ADR-0003 — Actions et clean architecture backoffice

**Date :** 2026-09-01  
**Statut :** Accepté

## Contexte

Le backoffice Super Sécurité accumulait la logique métier directement dans les contrôleurs (CRUD inline, import CSV, attach/detach pivot). Le projet Excorde (référence interne) utilise un pattern **Actions** avec contrôleurs minces, plus maintenable et testable.

Une demande produit exige d'aligner les **nouvelles** features sur ce pattern, sans refactoriser l'intégralité du legacy.

## Décision

1. Introduire `App\Actions\Action` comme classe de base marqueur.
2. Placer chaque cas d'utilisation métier dans `app/Actions/{Domaine}/` avec une méthode `handle()`.
3. Les contrôleurs ne mutent plus les modèles directement — ils délèguent aux Actions.
4. Les Services (`app/Services/`) restent pour la logique technique réutilisable ; une Action peut les composer.
5. Les toasts backoffice passent par `Inertia::flash('toast', …)` (Inertia v3), jamais `redirect()->with('toast', …)`.
6. **Périmètre immédiat :** module marketing clients & listes. Les autres modules restent en l'état jusqu'à évolution ou demande explicite.

## Conséquences

- **Positif :** contrôleurs lisibles, logique métier localisée, conventions alignées Excorde, toasts fiables.
- **Positif :** les agents IA et développeurs disposent d'une rule `.cursor/rules/clean-architecture.mdc`.
- **Négatif :** dette documentée sur les modules legacy (articles, partenaires, etc.) — deux styles coexistent temporairement.
- **Migration marketing :** 9 Actions dans `app/Actions/Marketing/`, contrôleurs refactorisés, `MarketingContactImportService` conservé et appelé par `ImportMarketingContacts`.

## Fichiers de référence

- Rule : `.cursor/rules/clean-architecture.mdc`
- Exemple : `app/Actions/Marketing/CreateMarketingContact.php`
- Contrôleur mince : `app/Http/Controllers/Admin/MarketingContactController.php`
