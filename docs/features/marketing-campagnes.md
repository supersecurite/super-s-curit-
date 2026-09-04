# Marketing — campagnes e-mail & WhatsApp

**Statut :** ⚠️ Partiel — **Lots 2–3** du [cahier des charges client](../CAHIER%20DES%20CHARGES.md)

## Vue d’ensemble

Outil type Mailchimp avec **canaux séparés** (pas d’amalgame UI) : campagnes **e-mail** et **WhatsApp** (Meta Cloud API), audience = **groupes et/ou contacts individuels**, suivi des accusés de réception et de lecture.

Voir [ADR-0002](../decisions/0002-marketing-meta-whatsapp-et-email.md).

## Acteurs & rôles

Commercial / admin avec permissions `marketing_campaigns.*` — voir `BackofficePermission`.

## Fonctionnement

### Séparation des canaux

- Sidebar : **E-mail** (templates, campagnes, comptes) vs **WhatsApp** (templates, campagnes, comptes) + **Commun** (contacts, groupes).
- Index filtrés par `?channel=email|whatsapp` (défaut e-mail).
- Création : canal **verrouillé** selon l’entrée menu (pas de bascule e-mail ↔ WhatsApp dans le formulaire).
- Campagne e-mail : sélection obligatoire d’un **compte e-mail** (SMTP / log + quota journalier).
- Campagne WhatsApp : sélection obligatoire d’un **compte WhatsApp**.

### Audience campagne

- Sélection multi via search select : `list_uuids[]` (groupes) + `contact_uuids[]` (contacts directs).
- Au moins un groupe **ou** un contact requis.
- Fusion sans doublon ; aperçu JSON `marketing-campaigns/audience-preview`.
- Lancement : `ResolveMarketingCampaignAudience::eligibleContacts` (consentement + e-mail **ou** téléphone selon le canal).

### Livré (Lot 2)

1. **Templates e-mail** (`/marketing-templates?channel=email`) — CRUD + variables dynamiques.
2. **Campagnes e-mail** — brouillon, **template e-mail obligatoire** (contenu prérempli puis éditable avant validation), lancement immédiat ou **planifié** (`scheduled_at` + commande `marketing:dispatch-scheduled-campaigns`), pixel d’ouverture, indicateurs type WhatsApp, temps réel Reverb, stats enrichies (donut + barres) sur la fiche détail.
3. **Comptes e-mail multi-SMTP** (`/marketing-email-accounts`) — expéditeur + SMTP (ou driver `log`), compte par défaut, **quota journalier** optionnel pour contourner les limites fournisseurs.

### Livré (Lot 3)

4. **Comptes WhatsApp multi-config** (`/marketing-whatsapp-accounts`) — credentials Meta en base (tokens chiffrés), driver `meta` \| `log`, compte par défaut, URL webhook par compte.
5. **Templates WhatsApp** — canal + `meta_template_name` / `meta_template_language` uniquement (modèle Meta approuvé, **pas** de corps libre).
6. **Campagnes WhatsApp** — compte + template Meta ; éligibilité consentement + téléphone ; job `SendMarketingCampaignWhatsAppJob`.
7. **Webhook Meta** — `GET|POST /webhooks/marketing/whatsapp/{uuid}` → `sent` / `delivered`→`received` / `read` / `failed` (anti-régression de statut).

### Prévu / dette

8. Bounces provider e-mail.
9. Sync automatique des templates depuis Meta Graph API.

## Accusés

| Canal | Réception | Lecture |
|---|---|---|
| WhatsApp | webhook Meta `delivered` → statut `received` (✓✓ gris) | webhook `read` → `read` (✓✓ vert) — non garanti par Meta |
| E-mail | accepté / bounce | pixel d’ouverture (approximation) |

UI fiche campagne WhatsApp : colonnes **Reçu (delivered)** / **Lu (read)** + légende des coches.

## Architecture

| Élément | Rôle |
|---|---|
| `MarketingEmailAccount` | Config SMTP multi-comptes + quota journalier |
| `ConfigureMarketingEmailMailer` | Mailer Laravel à la volée |
| `WhatsAppAccount` | Config Meta multi-comptes |
| `WhatsAppCloudApiService` | Envoi template Graph API / log |
| `SendMarketingCampaignWhatsAppJob` | Queue envoi WA |
| `RecordWhatsAppMessageStatus` | Mise à jour statut webhook (sans régression) |
| `SyncMarketingCampaignAudience` | Pivots listes + contacts |
| `ResolveMarketingCampaignAudience` | Fusion audience au lancement |
| `LaunchMarketingCampaign` | Branche e-mail ou WhatsApp ; planification si `scheduled_at` futur |
| `marketing:dispatch-scheduled-campaigns` | Scheduler chaque minute — lance les campagnes dues |

## Fichiers clés

| Couche | Fichier |
|---|---|
| Comptes e-mail | `app/Models/MarketingEmailAccount.php`, `Admin/MarketingEmailAccountController.php` |
| Comptes WA | `app/Models/WhatsAppAccount.php`, `Admin/WhatsAppAccountController.php` |
| Service / Job | `app/Services/Marketing/WhatsAppCloudApiService.php`, `SendMarketingCampaignWhatsAppJob.php` |
| Webhook | `MarketingWhatsAppWebhookController.php` |
| Pages | `resources/js/pages/marketing-email-accounts/`, `marketing-whatsapp-accounts/`, `marketing-campaigns/`, `marketing-templates/` |
| Tests | `tests/Feature/MarketingEmailAccountTest.php`, `WhatsAppAccountTest.php`, `MarketingWhatsAppCampaignTest.php`, `MarketingCampaignTest.php` |

## Limites & dette

- Bounces e-mail provider : non implémentés.
- Pas de sync templates Meta.
- WhatsApp : **uniquement** modèles Meta approuvés (pas de message texte libre).
- E-mail : template catalogue **obligatoire** ; l’objet et le corps restent modifiables sur la campagne avant validation.
- Planification : statut `scheduled` + `scheduled_at` ; dispatch via schedule Artisan.
- « Lu » WhatsApp et « ouvert » e-mail ne sont pas des garanties absolues.
- Secrets e-mail SMTP et WhatsApp : **uniquement en base** (pas `.env` pour ces comptes marketing).
- Legacy `marketing_list_id` conservé pour compat lecture (premier groupe sync).
- Quota e-mail : comptage des envois `sent_at` du jour ; le lancement refuse si l’audience dépasse le restant.
- Images éditeur : upload vers `storage/app/public/marketing/editor-images` (URL), **pas** de base64 dans le JSON Lexical.

## Outils locaux

```bash
php artisan marketing:purge super_admin@supersecurite.com --force
```

Purge contacts, listes, templates et campagnes. **Conserve** les comptes e-mail et WhatsApp. Disponible **uniquement en `local`**, et uniquement si l’e-mail fourni est un **super_admin**.
