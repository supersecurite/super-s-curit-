# Marketing — campagnes e-mail & WhatsApp

**Statut :** ⚠️ Partiel — **Lot 2 en cours** du [cahier des charges client](../CAHIER%20DES%20CHARGES.md)

## Vue d’ensemble

Outil type Mailchimp : campagnes vers une liste, canaux e-mail et/ou WhatsApp (Meta Cloud API), suivi des accusés de réception et de lecture.

Voir [ADR-0002](../decisions/0002-marketing-meta-whatsapp-et-email.md).

## Acteurs & rôles

Commercial / admin avec permissions `marketing_campaigns.*` — voir `BackofficePermission`.

## Fonctionnement

### Livré (Lot 2 — tranche 1)

1. **Modèles de messages e-mail** (`/marketing-templates`) — CRUD : titre interne, objet, contenu avec variables `{{prenom}}`, `{{nom}}`, `{{email}}`, `{{telephone}}`, `{{entreprise}}`, `{{role_entreprise}}`, `{{adresse}}`. Rendu via `RenderMarketingMessageTemplate`.

### Livré (Lot 2 — tranche 2)

2. **Campagnes e-mail** (`/marketing-campaigns`) — CRUD brouillon : nom, liste, modèle optionnel, objet, contenu personnalisable.
3. **Lancement** — action `LaunchMarketingCampaign` : envois individuels pour contacts avec consentement + e-mail ; jobs `SendMarketingCampaignEmailJob` (queue Laravel).
4. **Statuts** — campagne : `draft` → `sending` → `completed` | `failed` ; envoi : `queued` → `sent` → `received` → `read` | `failed` | `bounced`. Le statut `received` (« Reçu ») distingue un mail arrivé mais non ouvert d’un mail lu (`read`).
5. **E-mail** — `MarketingCampaignMailable` (layout brandé) + pixel d’ouverture (`GET /c/o/{token}`).
6. **UI** — fiche campagne : compteurs + tableau destinataires avec indicateurs type WhatsApp (1 ✓ envoyé, 2 ✓ gris reçu, 2 ✓ vert lu) ; bouton « Lancer » si permission `marketing_campaigns.send`.
7. **Temps réel (Reverb)** — mise à jour live de la fiche campagne pendant l’envoi :
   - Event `MarketingCampaignProgressUpdated` sur canal privé `marketing-campaign.{uuid}`
   - Dispatch depuis job d’envoi, sync de clôture, lancement et pixel d’ouverture
   - Frontend : Laravel Echo + hook `useMarketingCampaignRealtime` sur la page show
   - Actif si `BROADCAST_CONNECTION=reverb` (ou `pusher`) + variables `REVERB_*` / `VITE_REVERB_*`

### Prévu (suite Lot 2 / Lot 3)

8. Bounces provider e-mail (webhook / feedback loop).
9. WhatsApp Meta Cloud API (Lot 3).

- Intégration API Meta WhatsApp Cloud
- Modèles Meta approuvés + webhooks status

## Accusés

| Canal | Réception | Lecture |
|---|---|---|
| WhatsApp | webhook `delivered` | webhook `read` (selon confidentialité destinataire) |
| E-mail | accepté / bounce | ouverture pixel (approximation) |

## Architecture

Mutations métier via **Actions** ([ADR-0003](../decisions/0003-actions-clean-architecture.md)) :

| Action | Rôle |
|---|---|
| `CreateMarketingMessageTemplate` | Création modèle |
| `UpdateMarketingMessageTemplate` | Mise à jour modèle |
| `DeleteMarketingMessageTemplate` | Suppression modèle |
| `CreateMarketingCampaign` | Création campagne brouillon |
| `UpdateMarketingCampaign` | Mise à jour campagne brouillon |
| `DeleteMarketingCampaign` | Suppression campagne brouillon |
| `LaunchMarketingCampaign` | Lancement envois e-mail |
| `SyncMarketingCampaignCompletion` | Clôture campagne quand envois terminés |
| `SyncMarketingCampaignCompletionJob` | Job debouncé (3 s) — une sync par rafale d'envois |

## Fichiers clés

| Couche | Fichier |
|---|---|
| Modèle | `app/Models/MarketingMessageTemplate.php`, `MarketingCampaign.php`, `MarketingCampaignSend.php` |
| Actions | `app/Actions/Marketing/CreateMarketingMessageTemplate.php`, `CreateMarketingCampaign.php`, `LaunchMarketingCampaign.php`, … |
| Policy | `app/Policies/MarketingMessageTemplatePolicy.php`, `MarketingCampaignPolicy.php` |
| Variables / rendu | `app/Support/Marketing/RenderMarketingMessageTemplate.php`, `ResolveMarketingCampaignRecipient.php` |
| Job / Mail | `app/Jobs/SendMarketingCampaignEmailJob.php`, `SyncMarketingCampaignCompletionJob.php`, `app/Mail/MarketingCampaignMailable.php` |
| Temps réel | `app/Events/Marketing/MarketingCampaignProgressUpdated.php`, `app/Support/Marketing/BroadcastMarketingCampaignProgress.php`, `resources/js/lib/echo.ts`, `resources/js/hooks/use-marketing-campaign-realtime.ts` |
| Contrôleurs | `MarketingMessageTemplateController.php`, `MarketingCampaignController.php`, `MarketingCampaignOpenController.php` |
| Pages | `resources/js/pages/marketing-templates/`, `marketing-campaigns/` |
| Tests | `tests/Feature/MarketingMessageTemplateTest.php`, `MarketingCampaignTest.php` |

## Limites & dette

- Bounces e-mail provider : non implémentés (webhook à brancher selon mailer).
- Modèles WhatsApp : canal prévu en enum, UI Lot 3.
- Hors V1 : A/B tests, automations, éditeur drag-and-drop.
- « Lu » WhatsApp et « ouvert » e-mail ne sont pas des garanties absolues.

### Setup temps réel (local)

1. Copier les variables `REVERB_*` et `VITE_REVERB_*` depuis `.env.example`
2. `BROADCAST_CONNECTION=reverb`
3. Lancer `composer run dev` (serve + queue + Reverb + Vite) ou séparément `php artisan reverb:start`
4. En production : process Reverb dédié (ou Pusher managé si hébergement mutualisé)
