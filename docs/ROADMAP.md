# Roadmap — Super Sécurité

Document de pilotage vivant. Mets-le à jour à chaque tranche livrée. Ne duplique pas le contenu des fiches `docs/features/*.md` ni des règles `.cursor/rules/` — renvoie-y.

## 1. Comment travailler (non négociable)

```text
Choisir un item de la roadmap
  → Gate (docs/features/<module>.md + code + ADR)
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
| Authentification (Fortify, 2FA) | Plateforme | ✅ Complet | `docs/features/auth.md` |
| Dashboard | Plateforme | ✅ Complet | Filtré par permissions — `docs/features/dashboard.md` |
| Analytics / visites | Plateforme | ✅ Complet | Exclusion backoffice — `docs/features/analytics.md` |
| Actualités (articles) | Contenu | ✅ Complet | Approbation, feature — `docs/features/articles.md` |
| Conseils de sécurité | Contenu | ✅ Complet | `docs/features/conseils.md` |
| Galerie photos | Contenu | ✅ Complet | `docs/features/galerie.md` |
| Galerie vidéos | Contenu | ✅ Complet | `docs/features/galerie.md` |
| Partenaires | Contenu | ✅ Complet | `docs/features/partenaires.md` |
| Candidatures agents | RH | ✅ Complet | `docs/features/candidatures-agents.md` |
| Utilisateurs & permissions | Acteurs | ✅ Complet | Tabs édition, permissions UI — `docs/features/utilisateurs-roles.md` |
| Site marketing public | Public | ✅ Complet | `docs/features/site-public.md` |
| Paramètres (profil / sécurité) | Plateforme | ✅ Complet | `docs/features/settings.md` |
| Rôle commercial | Acteurs | 🔲 À construire | [ADR-0001](decisions/0001-role-commercial.md) |
| Marketing — clients & listes | Marketing | 🔲 À construire | `docs/features/marketing-clients.md` |
| Marketing — campagnes e-mail / WhatsApp | Marketing | 🔲 À construire | [ADR-0002](decisions/0002-marketing-meta-whatsapp-et-email.md) · `docs/features/marketing-campagnes.md` |

Légende : ✅ Complet · ⚠️ Partiel/dette · 🔲 À construire

## 3. Prochaine livraison — dette / consolidation

1. **Phase 0 docs** (cette livraison) : infrastructure `docs/` + rules + ADR marketing — soldée une fois ce fichier et les fiches présentes.
2. Vérifier qu’aucune nouvelle route backoffice n’échappe à `VisitTracking::BACKOFFICE_PREFIXES`.
3. Surveiller la dette TypeScript globale (`tsc`) hors fichiers récemment corrigés.

## 4. Modules à construire (roadmap produit)

### 4.1 Rôle `commercial`

Voir [ADR-0001](decisions/0001-role-commercial.md). Permissions marketing par défaut ; assignable par admin / super_admin.

### 4.2 Clients & listes (CRM léger)

CRUD contacts, listes / audiences, import CSV. Fiche : `docs/features/marketing-clients.md`.

### 4.3 Campagnes e-mail & WhatsApp (type Mailchimp)

- E-mail : Laravel Mail + queue, tracking livraison / ouverture.
- WhatsApp : Meta Cloud API, templates hors fenêtre 24h, webhooks `delivered` / `read`.
- Accusés de réception et de lecture en V1.
- Voir [ADR-0002](decisions/0002-marketing-meta-whatsapp-et-email.md).

Ordre d’implémentation suggéré :

1. Rôle commercial + permissions `marketing.*`
2. Clients + listes + import CSV
3. Campagnes e-mail + file d’attente + tracking ouverture
4. WhatsApp Meta + webhooks + UI accusés

## 5. Invariants transverses

Voir `.cursor/rules/domain-invariants.mdc`.

## 6. Cartographie rapide du code

| Zone | Chemins |
|---|---|
| Routes | `routes/web.php`, `routes/settings.php` |
| Backoffice | `app/Http/Controllers/Admin/`, `UserController`, `DashboardController`, `AnalyticsController` |
| Public | `app/Http/Controllers/Marketing/`, pages `resources/js/pages/marketing/` |
| Permissions | `app/Enums/BackofficePermission.php`, `app/Models/User.php` |
| Tracking | `app/Http/Middleware/TrackVisit.php`, `app/Support/VisitTracking.php` |
| Pages app | `resources/js/pages/{articles,conseils,users,dashboard,analytics,...}/` |

## 7. Historique

| Date | Entrée |
|---|---|
| 2026-08-31 | Phase 0 : ROADMAP, features, ADR, rules Cursor, AGENTS hub |
