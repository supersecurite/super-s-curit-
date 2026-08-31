# ADR-0002 : Marketing e-mail + WhatsApp Meta Cloud API + accusés

## Status

Accepted

## Date

2026-08-31

## Context

Besoin d’un outil interne type Mailchimp : listes clients, campagnes en masse, canaux **e-mail** et **WhatsApp**. WhatsApp doit passer par l’**API officielle Meta Cloud**. Les accusés de **réception** et de **lecture** sont exigés en V1.

## Decision

### Canaux

1. **WhatsApp** : Meta WhatsApp Cloud API uniquement (pas de Twilio / wa.me comme canal principal).
2. Hors fenêtre de conversation 24h : envoi **uniquement via templates** Meta approuvés.
3. **E-mail** : Laravel Mail + queue (`ShouldQueue`) ; provider SMTP / mailer configuré via `.env`.

### Données (cible V1)

- Contacts + listes (voir fiche `marketing-clients.md`).
- Campagnes (`channel`: email | whatsapp | both selon besoin produit).
- Envois individuels avec :
  - `status` : `queued` → `sent` → `delivered` → `read` | `failed` | `bounced`
  - `sent_at`, `delivered_at`, `read_at`, `failed_at`
  - `provider_message_id`
  - payload / métadonnées webhook pour audit

### Accusés de réception et de lecture

| Canal | Réception (livré) | Lecture |
|---|---|---|
| WhatsApp | Webhook Meta status `delivered` | Webhook `read` (peut être absent selon confidentialité du destinataire) |
| E-mail | Acceptation transport / bounce | Pixel d’ouverture (approximation — pas un read receipt SMTP fiable) |

Endpoint webhook Meta dédié (csrf exempt, signature validée) pour mettre à jour les envois.

### UI

Compteurs campagne (envoyés / livrés / lus / échecs) + liste détaillée par destinataire.

### Hors scope V1

A/B tests, automations, éditeur drag-and-drop, segments avancés.

## Alternatives Considered

### Liens `wa.me` / WhatsApp Web non officiel
- Pros : rapide à prototyper
- Cons : pas d’API fiable, pas de webhooks delivered/read, non conforme Business
- Rejected because : incompatible avec les accusés et un usage pro

### Twilio comme proxy WhatsApp
- Pros : DX parfois plus simple
- Cons : couche et coût supplémentaires alors que Meta Cloud est le choix produit
- Rejected because : décision explicite d’utiliser Meta

### E-mail sans tracking d’ouverture
- Pros : plus simple, moins de questions privacy
- Cons : ne répond pas à l’exigence « accusé de lecture » côté mail
- Rejected because : V1 exige un signal de lecture approximatif (pixel) documenté comme tel

## Consequences

- Secrets Meta (`WHATSAPP_*` / Graph token, phone number id, verify token, app secret) dans `.env` — jamais commités.
- Queue worker obligatoire en prod pour les envois.
- Documentation claire dans l’UI : le « lu » WhatsApp et l’« ouvert » e-mail ne sont pas absolus.
- Nouvelles routes backoffice + webhook : ajouter les préfixes exclus de `VisitTracking` si besoin.
- Implémentation après rôle commercial (ADR-0001) et module clients.
