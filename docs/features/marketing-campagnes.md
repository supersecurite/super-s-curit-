# Marketing — campagnes e-mail & WhatsApp

**Statut :** ⚠️ Partiel — **Lots 2–3** du [cahier des charges client](../CAHIER%20DES%20CHARGES.md)

## Vue d’ensemble

Outil type Mailchimp avec **canaux séparés** (pas d’amalgame UI) : campagnes **e-mail** et **WhatsApp** (Meta Cloud API), audience = **groupes et/ou contacts individuels**, suivi des accusés de réception et de lecture.

Voir [ADR-0002](../decisions/0002-marketing-meta-whatsapp-et-email.md).

## Acteurs & rôles

Commercial / admin avec permissions `marketing_campaigns.*` — voir `BackofficePermission`.

## Fonctionnement

### Séparation des canaux

- Sidebar : **Templates e-mail** / **Campagnes e-mail** vs **Templates WhatsApp** / **Campagnes WhatsApp** (+ comptes WhatsApp).
- Index filtrés par `?channel=email|whatsapp` (défaut e-mail).
- Création : canal **verrouillé** selon l’entrée menu (pas de bascule e-mail ↔ WhatsApp dans le formulaire).

### Audience campagne

- Sélection multi via search select : `list_uuids[]` (groupes) + `contact_uuids[]` (contacts directs).
- Au moins un groupe **ou** un contact requis.
- Fusion sans doublon ; aperçu JSON `marketing-campaigns/audience-preview`.
- Lancement : `ResolveMarketingCampaignAudience::eligibleContacts` (consentement + e-mail **ou** téléphone selon le canal).

### Livré (Lot 2)

1. **Templates e-mail** (`/marketing-templates?channel=email`) — CRUD + variables dynamiques.
2. **Campagnes e-mail** — brouillon, lancement queue, pixel d’ouverture, indicateurs type WhatsApp, temps réel Reverb.

### Livré (Lot 3)

3. **Comptes WhatsApp multi-config** (`/marketing-whatsapp-accounts`) — credentials Meta en base (tokens chiffrés), driver `meta` \| `log`, compte par défaut, URL webhook par compte.
4. **Templates WhatsApp** — canal + `meta_template_name` / `meta_template_language` uniquement (modèle Meta approuvé, **pas** de corps libre).
5. **Campagnes WhatsApp** — compte + template Meta ; éligibilité consentement + téléphone ; job `SendMarketingCampaignWhatsAppJob`.
6. **Webhook Meta** — `GET|POST /webhooks/marketing/whatsapp/{uuid}` → `sent` / `delivered`→`received` / `read` / `failed` (anti-régression de statut).

### Prévu / dette

7. Bounces provider e-mail.
8. Sync automatique des templates depuis Meta Graph API.

## Accusés

| Canal | Réception | Lecture |
|---|---|---|
| WhatsApp | webhook Meta `delivered` → statut `received` (✓✓ gris) | webhook `read` → `read` (✓✓ vert) — non garanti par Meta |
| E-mail | accepté / bounce | pixel d’ouverture (approximation) |

UI fiche campagne WhatsApp : colonnes **Reçu (delivered)** / **Lu (read)** + légende des coches.

## Architecture

| Élément | Rôle |
|---|---|
| `WhatsAppAccount` | Config Meta multi-comptes |
| `WhatsAppCloudApiService` | Envoi template Graph API / log |
| `SendMarketingCampaignWhatsAppJob` | Queue envoi WA |
| `RecordWhatsAppMessageStatus` | Mise à jour statut webhook (sans régression) |
| `SyncMarketingCampaignAudience` | Pivots listes + contacts |
| `ResolveMarketingCampaignAudience` | Fusion audience au lancement |
| `LaunchMarketingCampaign` | Branche e-mail ou WhatsApp |

## Fichiers clés

| Couche | Fichier |
|---|---|
| Comptes | `app/Models/WhatsAppAccount.php`, `Admin/WhatsAppAccountController.php` |
| Service / Job | `app/Services/Marketing/WhatsAppCloudApiService.php`, `SendMarketingCampaignWhatsAppJob.php` |
| Webhook | `MarketingWhatsAppWebhookController.php` |
| Pages | `resources/js/pages/marketing-whatsapp-accounts/`, `marketing-campaigns/`, `marketing-templates/` |
| Tests | `tests/Feature/WhatsAppAccountTest.php`, `MarketingWhatsAppCampaignTest.php`, `MarketingCampaignTest.php` |

## Limites & dette

- Bounces e-mail provider : non implémentés.
- Pas de sync templates Meta.
- WhatsApp : **uniquement** modèles Meta approuvés (pas de message texte libre).
- « Lu » WhatsApp et « ouvert » e-mail ne sont pas des garanties absolues.
- Secrets WhatsApp : **uniquement en base** (pas `.env`).
- Legacy `marketing_list_id` conservé pour compat lecture (premier groupe sync).
