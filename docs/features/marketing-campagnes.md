# Marketing — campagnes e-mail & WhatsApp

**Statut :** ⚠️ Partiel — **Lots 2–3** du [cahier des charges client](../CAHIER%20DES%20CHARGES.md)

## Vue d’ensemble

Outil type Mailchimp : campagnes vers une liste, canaux **e-mail** et **WhatsApp** (Meta Cloud API), suivi des accusés de réception et de lecture.

Voir [ADR-0002](../decisions/0002-marketing-meta-whatsapp-et-email.md).

## Acteurs & rôles

Commercial / admin avec permissions `marketing_campaigns.*` — voir `BackofficePermission`.

## Fonctionnement

### Livré (Lot 2)

1. **Templates e-mail** (`/marketing-templates`) — CRUD + variables dynamiques.
2. **Campagnes e-mail** — brouillon, lancement queue, pixel d’ouverture, indicateurs type WhatsApp, temps réel Reverb.

### Livré (Lot 3)

3. **Comptes WhatsApp multi-config** (`/marketing-whatsapp-accounts`) — credentials Meta en base (tokens chiffrés), driver `meta` \| `log`, compte par défaut, URL webhook par compte.
4. **Templates WhatsApp** — canal + `meta_template_name` / `meta_template_language` (modèle Meta approuvé).
5. **Campagnes WhatsApp** — sélection canal + compte + template ; éligibilité consentement + téléphone ; job `SendMarketingCampaignWhatsAppJob`.
6. **Webhook Meta** — `GET|POST /webhooks/marketing/whatsapp/{uuid}` (signature `X-Hub-Signature-256`, challenge verify_token) → statuts `sent` / `delivered`→`received` / `read` / `failed`.

### Prévu / dette

7. Bounces provider e-mail.
8. Sync automatique des templates depuis Meta Graph API.

## Accusés

| Canal | Réception | Lecture |
|---|---|---|
| WhatsApp | webhook Meta `delivered` | webhook `read` (non garanti) |
| E-mail | accepté / bounce | pixel d’ouverture (approximation) |

## Architecture

| Élément | Rôle |
|---|---|
| `WhatsAppAccount` | Config Meta multi-comptes |
| `WhatsAppCloudApiService` | Envoi template Graph API / log |
| `SendMarketingCampaignWhatsAppJob` | Queue envoi WA |
| `RecordWhatsAppMessageStatus` | Mise à jour statut webhook |
| `LaunchMarketingCampaign` | Branche e-mail ou WhatsApp |

## Fichiers clés

| Couche | Fichier |
|---|---|
| Comptes | `app/Models/WhatsAppAccount.php`, `Admin/WhatsAppAccountController.php` |
| Service / Job | `app/Services/Marketing/WhatsAppCloudApiService.php`, `SendMarketingCampaignWhatsAppJob.php` |
| Webhook | `MarketingWhatsAppWebhookController.php` |
| Pages | `resources/js/pages/marketing-whatsapp-accounts/`, `marketing-campaigns/`, `marketing-templates/` |
| Tests | `tests/Feature/WhatsAppAccountTest.php`, `MarketingWhatsAppCampaignTest.php` |

## Limites & dette

- Bounces e-mail provider : non implémentés.
- Pas de sync templates Meta.
- « Lu » WhatsApp et « ouvert » e-mail ne sont pas des garanties absolues.
- Secrets WhatsApp : **uniquement en base** (pas `.env`).
