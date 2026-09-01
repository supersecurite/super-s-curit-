# ADR-0004 : Debounce jobs queue Laravel 13

## Status

Accepted

## Date

2026-09-01

## Context

Laravel 13 introduit `#[DebounceFor]` pour les jobs queue (et listeners queue). Lorsqu'un même job est dispatché plusieurs fois dans une fenêtre courte, seule la **dernière** exécution est conservée ; les précédentes sont retirées de la queue à l'exécution (`JobDebounced`).

Super Sécurité utilise des queues pour les campagnes marketing et d'autres traitements asynchrones. Sans convention, les agents et développeurs risquent de :
- appeler une Action de sync en boucle depuis chaque job enfant ;
- confondre debounce (last-wins) et `ShouldBeUnique` (first-wins).

## Decision

1. **Convention obligatoire** documentée dans `.cursor/rules/queue-debounce.mdc` (`alwaysApply: true`).
2. **Premier cas d'usage** : `SyncMarketingCampaignCompletionJob` debouncé (3 s, `maxWait: 30`) — remplace l'appel direct à `SyncMarketingCampaignCompletion` depuis chaque `SendMarketingCampaignEmailJob`.
3. **Règle de choix** :
   - Agrégation / sync après rafale → debounce ;
   - Envoi unitaire distinct → pas de debounce ;
   - Exclusivité stricte au dispatch → `ShouldBeUnique`.
4. Les **Actions** restent la source de vérité métier ; les jobs debouncés restent minces.

## Alternatives Considered

### Appeler l'Action de sync directement depuis chaque job enfant
- Pros : simple, pas de cache
- Cons : N exécutions inutiles ; course possible sur le statut campagne
- Rejected because : ne scale pas avec le volume d'envois

### `ShouldBeUnique` sur le job de sync
- Pros : une seule instance en queue
- Cons : first-wins — un dispatch antérieur bloquerait la sync finale après le dernier envoi
- Rejected because : sémantique inverse du besoin (on veut le **dernier** état)

### Délai fixe `delay()` sans debounce
- Pros : réduit la fréquence
- Cons : ne garantit pas « une seule exécution après la rafale »
- Rejected because : inférieur au debounce natif Laravel 13

## Consequences

- Cache applicatif requis en prod pour le debounce (store par défaut Laravel).
- Nouveaux jobs queue : revue systématique debounce vs unique vs aucun.
- Tests Feature : au minimum assert dispatch du job debouncé sur le chemin métier.

## Références

- [Queues — Debounced Jobs (Laravel 13)](https://laravel.com/docs/13.x/queues#debounced-jobs)
- `.cursor/rules/queue-debounce.mdc`
