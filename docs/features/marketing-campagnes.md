# Marketing — campagnes e-mail & WhatsApp

**Statut :** 🔲 Placeholder

## Vue d’ensemble

Outil type Mailchimp : campagnes vers une liste, canaux e-mail et/ou WhatsApp (Meta Cloud API), suivi des accusés de réception et de lecture.

Voir [ADR-0002](../decisions/0002-marketing-meta-whatsapp-et-email.md).

## Acteurs & rôles (prévu)

Commercial / admin avec `marketing.campaigns.*` (noms exacts à définir dans `BackofficePermission` à l’implémentation).

## Fonctionnement (prévu)

1. Créer une campagne (nom, canal, liste, contenu / template WhatsApp).
2. File d’attente d’envois individuels.
3. Statuts par destinataire : `queued` → `sent` → `delivered` → `read` (ou `failed` / `bounced`).
4. WhatsApp : templates Meta hors fenêtre 24h ; webhooks status.
5. E-mail : Laravel Mail + pixel d’ouverture + bounces selon provider.
6. UI : compteurs campagne + détail destinataires.

## Accusés

| Canal | Réception | Lecture |
|---|---|---|
| WhatsApp | webhook `delivered` | webhook `read` (selon confidentialité destinataire) |
| E-mail | accepté / bounce | ouverture pixel (approximation) |

## Fichiers clés

Aucun backend encore.

## Limites & dette

- Hors V1 : A/B tests, automations, éditeur drag-and-drop.
- « Lu » WhatsApp et « ouvert » e-mail ne sont pas des garanties absolues.
