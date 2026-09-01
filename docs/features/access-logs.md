# Journal d'accès backoffice

**Statut :** ✅ Livré

## Vue d'ensemble

Monitoring interne sans package tiers (pas Nightwatch) : chaque requête authentifiée réussie est journalisée avec une **phrase métier** (« Aristide a modifié le contact Jean Dupont »).

Distinct du module **Analytics** (visites publiques uniquement). Le site marketing public (`/`, `/actualites`, `/contact`, …) n'est **jamais** journalisé, même pour un utilisateur connecté.

## Acteurs & permissions

- Permission : `access_logs.view` (`BackofficePermission::AccessLogsView`)
- Par défaut : admins avec toutes les permissions ; super_admin implicite
- Le commercial **n'a pas** accès au journal (sauf attribution explicite)

## Fonctionnement

1. **Middleware** `RecordAccessLog` — GET = consultation, POST/PUT/PATCH/DELETE = action
2. **Descriptions** — `DescribeRequestActivity` mappe routes + modèles → phrase FR
3. **Client** — `ResolveAccessLogClient` extrait navigateur (User-Agent) et pays (GeoIP / Cloudflare)
4. **Page complète** — `/access-logs` avec filtres : recherche globale (tous les champs texte), dates, utilisateur, type, IP, pays, navigateur, méthode HTTP, tri colonnes, pagination ; colonne Origine (drapeau, pays, navigateur)
5. **Accordéon global** — `BackofficePageShell` + `ActionHistoryAccordion` sur **toutes** les pages backoffice (dashboard, CRUD, paramètres, analytics…) : même tableau et filtres que `/access-logs` ; masqué uniquement sur la page journal dédiée
6. **Purge** — commande `access-logs:prune` planifiée quotidiennement ; rétention `ACCESS_LOGS_RETENTION_DAYS` (défaut 365)

## Exclusions (non journalisé)

- Invités, erreurs HTTP ≥ 400, prefetch Inertia, validation échouée
- **Pages du site web public** (accueil, actualités, contact, services, …)
- Chemins `access-logs/*`, `analytics/duration`, assets, `/up`
- Requêtes JSON sans header `X-Inertia`

## Fichiers clés

| Couche | Fichier |
|---|---|
| Modèle | `app/Models/AccessLog.php` |
| Enum | `app/Enums/AccessLogKind.php` |
| Middleware | `app/Http/Middleware/RecordAccessLog.php` |
| Descriptions | `app/Support/AccessLogs/DescribeRequestActivity.php` |
| Client (navigateur / pays) | `app/Services/AccessLogs/ResolveAccessLogClient.php` |
| Requête filtrée | `app/Services/AccessLogs/BuildAccessLogQuery.php` |
| Options filtres | `app/Services/AccessLogs/AccessLogFilterOptions.php` |
| Action purge | `app/Actions/AccessLogs/PruneAccessLogs.php` |
| Contrôleur | `app/Http/Controllers/Admin/AccessLogController.php` |
| Policy | `app/Policies/AccessLogPolicy.php` |
| UI journal | `resources/js/pages/access-logs/index.tsx` |
| UI tableau partagé | `resources/js/components/access-logs/access-logs-table.tsx` |
| UI shell backoffice | `resources/js/components/backoffice-page-shell.tsx` |
| Hook feed accordéon | `resources/js/hooks/use-access-logs-feed.ts` |
| UI accordéon global | `resources/js/components/action-history-panel.tsx` (`ActionHistoryAccordion`)
| UI origine client | `resources/js/components/access-logs/access-log-client-meta.tsx` |
| Tests | `tests/Feature/AccessLogTest.php` |

## Limites & dette

- Pas de diff des champs modifiés — description textuelle uniquement
- Modules legacy journalisés via middleware (pas via Actions individuelles)
- Pas de filtre par entité UUID structuré — approximation par URL (`scope=page`)
