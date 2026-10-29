# Roadmap — Super Sécurité

Document de pilotage vivant. Mets-le à jour à chaque tranche livrée. Ne duplique pas le contenu des fiches `docs/features/*.md` ni des règles `.cursor/rules/` — renvoie-y.

**Référence client :** [CAHIER DES CHARGES.md](CAHIER%20DES%20CHARGES.md) — module communication e-mail & WhatsApp (1 500 000 GNF, livraison forfaitaire après validation du module complet).

## 1. Comment travailler (non négociable)

```text
Choisir un item de la roadmap
  → Gate (docs/features/<module>.md + code + ADR + CDC client si marketing)
  → Vérifier les invariants (.cursor/rules/domain-invariants.mdc)
  → Tranche verticale (migration → … → tests)
  → Gate qualité (Pest + Pint sur le périmètre)
  → DoD (feature-workflow.mdc)
  → Mettre à jour docs/features + cette roadmap (+ ADR si besoin)
  → Item suivant
```

Voir `AGENTS.md` et `CONTRIBUTING.md`.

## 2. État des modules

| Module | Domaine | Statut | Détail |
|---|---|---|---|
| Authentification (Fortify, 2FA, verrouillage inactivité) | Plateforme | ✅ Complet | `docs/features/auth.md` |
| Dashboard | Plateforme | ✅ Complet | Filtré par permissions — `docs/features/dashboard.md` |
| Analytics / visites | Plateforme | ✅ Complet | Exclusion backoffice — `docs/features/analytics.md` |
| Actualités (articles) | Contenu | ✅ Complet | Approbation, feature — `docs/features/articles.md` |
| Conseils de sécurité | Contenu | ✅ Complet | `docs/features/conseils.md` |
| Galerie photos / vidéos | Contenu | ✅ Complet | `docs/features/galerie.md` |
| Partenaires | Contenu | ✅ Complet | `docs/features/partenaires.md` |
| Candidatures agents | RH | ✅ Complet | `docs/features/candidatures-agents.md` |
| Utilisateurs & permissions | Acteurs | ✅ Complet | `docs/features/utilisateurs-roles.md` |
| Rôle `commercial` + droits marketing | Acteurs | ✅ Complet | [ADR-0001](decisions/0001-role-commercial.md) — prérequis module communication |
| Site marketing public | Public | ✅ Complet | i18n FR/EN phase 2 (backoffice session + CMS `*_en`) — [ADR-0005](decisions/0005-i18n-public-url-prefix.md) · [ADR-0006](decisions/0006-backoffice-locale-session.md) · `docs/features/site-public.md` |
| Paramètres (profil / sécurité) | Plateforme | ✅ Complet | `docs/features/settings.md` |
| **Lot 1 — Contacts & listes** | Marketing | ✅ Complet | CDC §5.1 — `docs/features/marketing-clients.md` · seeder `MarketingSeeder` |
| **Journal d'accès backoffice** | Support | ✅ Complet | `docs/features/access-logs.md` — monitoring sans Nightwatch |
| **Lot 2 — Campagnes e-mail** | Marketing | ✅ Complet | Canaux séparés · comptes SMTP multi + quotas · audience mixte · Reverb — bounces provider 🔲 — [ADR-0002](decisions/0002-marketing-meta-whatsapp-et-email.md) |
| **Lot 3 — Campagnes WhatsApp** | Marketing | ✅ Complet | Comptes Meta · templates · audience mixte · webhook delivered/read — `docs/features/marketing-campagnes.md` |

Légende : ✅ Complet · ⚠️ Partiel/dette · 🔲 À construire

## 3. Prochaine livraison

**Lot 2 — dette** : bounces e-mail (webhook provider).

**Lot 3 — Campagnes WhatsApp** — ✅ livré :

- Comptes WhatsApp multi-config en base (`/marketing-whatsapp-accounts`)
- Templates Meta + campagnes canal WhatsApp
- Jobs queue + webhook statuts signé
- Tests Feature + seeder compte « Démo locale » (driver log)

Dette transverse à surveiller :

- Nouvelles routes backoffice marketing → `VisitTracking::BACKOFFICE_PREFIXES`
- Dette TypeScript globale (`tsc`) hors périmètre touché
- i18n : segments URL EN (`/en/about`) ; formulaires publics (contact / candidature) encore FR

## 4. Module communication — plan d’implémentation

Aligné sur le **CDC client** (3 lots fonctionnels, recette globale, facturation unique à la livraison complète).

### 4.0 Prérequis plateforme — ✅ livré

| Élément | Statut |
|---|---|
| Rôle `commercial` | ✅ [ADR-0001](decisions/0001-role-commercial.md) |
| Permissions `marketing_clients.*` / `marketing_campaigns.*` | ✅ `BackofficePermission` |
| UI gestion utilisateurs (profil Commercial, panneau droits) | ✅ |
| `dashboard.view` pour le commercial | ✅ |

### 4.1 Lot 1 — Contacts et listes — ✅ livré

| Périmètre CDC | Livrable technique |
|---|---|
| Fiches contact, recherche, filtres, doublons | `MarketingContact`, policies, Actions, CRUD `/marketing-clients` |
| Listes de diffusion | `MarketingList` + pivot, Actions, CRUD `/marketing-lists` |
| Import CSV + rapport | `ImportMarketingContacts` → `MarketingContactImportService`, `/marketing-clients/import` |

Fiche : `docs/features/marketing-clients.md`

### 4.2 Lot 2 — Campagnes e-mail

| Périmètre CDC | Livrable technique |
|---|---|
| Modèles de messages (e-mail, variables dynamiques) | ✅ CRUD `/marketing-templates` |
| Campagnes individuelles / groupées | Jobs queue Laravel |
| Historique et statuts | Table envois, statuts `queued` → `sent` → `delivered` / `failed` / `bounced` |
| Suivi réception / ouverture (si provider le permet) | Pixel ouverture, bounces — [ADR-0002](decisions/0002-marketing-meta-whatsapp-et-email.md) |
| Tableau de bord (partie e-mail) | Stats enrichies fiche campagne (donut + barres + taux) + Reverb |
| Template obligatoire + planification | Template e-mail requis ; lancement immédiat ou `scheduled_at` |

Fiche : `docs/features/marketing-campagnes.md`

### 4.3 Lot 3 — Campagnes WhatsApp — ✅ livré

| Périmètre CDC | Livrable technique |
|---|---|
| Intégration API Meta WhatsApp Cloud | `WhatsAppCloudApiService` + comptes DB |
| Modèles Meta approuvés + variables | Templates canal WhatsApp + `meta_template_*` |
| Envois individuels / groupés | `SendMarketingCampaignWhatsAppJob` |
| Statuts : envoyé, livré, lu, échec | Webhook `/webhooks/marketing/whatsapp/{uuid}` |
| Tableau de bord (partie WhatsApp) | Fiche campagne + compteurs existants |

Fiche : `docs/features/marketing-campagnes.md` · [ADR-0002](decisions/0002-marketing-meta-whatsapp-et-email.md)

### 4.4 Recette, livraison et facturation (CDC)

| Élément | Règle client |
|---|---|
| Lots | Étapes internes de développement successives |
| Recette | Globale avant mise en production (CDC §20) |
| Facturation | **1 500 000 GNF** à la livraison du **module complet** validé (CDC §22) |
| Hors scope | Évolutions §21 · frais tiers §18 · maintenance §23 |

## 5. Invariants transverses

Voir `.cursor/rules/domain-invariants.mdc`.

## 6. Cartographie rapide du code

| Zone | Chemins |
|---|---|
| Routes | `routes/web.php`, `routes/settings.php` |
| Backoffice | `app/Http/Controllers/Admin/`, `UserController`, `DashboardController`, `AnalyticsController` |
| Marketing (Lot 1) | `app/Actions/Marketing/`, contrôleurs `Admin/Marketing*` |
| Marketing (Lots 2–3, à créer) | `app/Actions/Marketing/` (campagnes) |
| Public | `app/Http/Controllers/Marketing/`, pages `resources/js/pages/marketing/` |
| Permissions | `app/Enums/BackofficePermission.php`, `app/Models/User.php` |
| Tracking | `app/Http/Middleware/TrackVisit.php`, `app/Support/VisitTracking.php` |
| Pages app | `resources/js/pages/{articles,conseils,users,dashboard,analytics,...}/` |

## 7. Historique

| Date | Entrée |
|---|---|
| 2026-08-31 | Phase 0 : ROADMAP, features, ADR, rules Cursor, AGENTS hub |
| 2026-08-31 | Prérequis marketing : rôle `commercial`, permissions `marketing_*`, seeder, tests |
| 2026-09-01 | Cahier des charges client — 3 lots, 1,5 M GNF, paiement à livraison complète |
| 2026-09-02 | Lot 3 WhatsApp : comptes multi-config DB, envois Meta, webhook, tests |

- 2026-10-23 : correction de la langue conservée après changement de préférence navigateur (session et cookie).

- 2026-10-26 : chinois simplifié, routes /zh, SEO et traduction des composants et petites interfaces FR/EN/ZH.

- 2026-10-26 : correction des interfaces publiques actualités, conseils, galerie et contact ; navigation et partage conservant la langue FR/EN/ZH, tests de rendu dédiés.

- 2026-10-27 : branche V2, refonte de la page accueil selon la maquette client, thème rouge, responsive et FR/EN/ZH préservés. Photo retouchée en lumière neutre claire avec logo au dos de l’agent ; menu superposé bleu nuit légèrement translucide et ombre latérale unique intégrée à la photo, sans voile CSS.

- 2026-10-27 : layout public, footer V2 commun avec présence en Guinée, carte et devis ; menu mobile bleu nuit avec Services/Ressources regroupés, navigation responsive localisée ; aucune modification du contenu métier des pages.

- 2026-10-28 : accueil et À propos V2 adaptés aux maquettes, navigation commune, sélection éditoriale et contenus historiques préservés, versions FR/EN/zh et mobile.

- 29 octobre 2026 — V2 : page Sécurité entreprise adaptée à la maquette (prestations, supervision, méthode, FAQ, médias existants et liens vers les autres services), interface FR/EN/zh et navigation V2.

- 29 octobre 2026 — V2 : les trois pages Résidence, Chantiers et Zones minières sont adaptées aux maquettes 04/05/06, avec visuels propres, contenu métier conservé, FAQ, médias publiés et interface FR/EN/zh. Navigation V2 sur les quatre pages services.
