# Analytics / visites

**Statut :** ✅ Complet

## Vue d’ensemble

Enregistrement des pages vues du site public (middleware `TrackVisit`), durée côté client (hook marketing), dashboard analytics filtré (pays, villes, pages, période).

## Acteurs & rôles

Consultation : permission `analytics.view`. Enregistrement : visiteurs anonymes / session sur chemins publics.

## Fonctionnement

1. GET public → `TrackVisit` crée une `Visit` si le path n’est pas exclu.
2. Layout marketing → `useVisitTracker` envoie la durée à `POST /analytics/duration`.
3. Backoffice `/analytics` : KPIs, graphiques, top pages, etc.

Exclusions : voir `App\Support\VisitTracking` (backoffice, auth, robots, etc.).

## Fichiers clés

- `app/Http/Middleware/TrackVisit.php`
- `app/Support/VisitTracking.php`
- `app/Models/Visit.php`
- `app/Http/Controllers/AnalyticsController.php`
- `resources/js/pages/analytics/index.tsx`
- `resources/js/hooks/use-visit-tracker.ts`
- `tests/Feature/VisitorTrackingTest.php`

## Limites & dette

- Toute nouvelle route admin doit être ajoutée aux préfixes exclus.
- Les bots sont enregistrés mais filtrés dans les KPIs (`is_bot = false`).
