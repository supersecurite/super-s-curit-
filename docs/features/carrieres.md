# Carrières — offres d'emploi

**Statut :** ✅ Complet

## Vue d’ensemble

Page publique `/carrieres` listant les offres d’emploi actives (maquette recrutement V2), avec candidature liée à une offre. Backoffice CRUD des offres (`/offres-emploi`) + suivi des candidatures existant étendu.

## Acteurs & rôles

- Public : consulter les offres actives, postuler (throttle + reCAPTCHA).
- Backoffice offres : `job_offers.view|create|update|delete`.
- Backoffice candidatures : `agent_applications.view|update` (filtre et détail par offre).

## Fonctionnement

### Public

- `GET /carrieres` — page dédiée (hero type Contact, liste des offres `is_active` avec `excerpt` texte brut — pas le JSON Lexical —, coordonnées RH et carte). Téléphones RH : +224 613207531, +224 623933385. E-mail : rh@supersecurite.com. Adresse : siège.
- `GET /carrieres/{slug}/postuler` — détail d’offre (mise en page type articles, `ContentRenderer`) + formulaire de candidature.
- `POST /carrieres/{slug}/postuler` — crée `SecurityAgentApplication` avec `job_offer_id`.
- `GET /carrieres/merci` — confirmation.
- Redirects 301 : `/devenir-agent` → `/carrieres`, `/devenir-agent/merci` → `/carrieres/merci`.

### Backoffice offres

- CRUD `/offres-emploi` via Actions (`CreateJobOffer`, `UpdateJobOffer`, `ToggleJobOfferActive`, `DeleteJobOffer`).
- Traductions CMS FR/EN/ZH : onglets dans le formulaire (`*_en`, `*_zh` pour titre, lieu, contrat, description). Locale publique via `JobOffer::localized()` (fallback FR).
- Description saisie avec l’éditeur Lexical (même composant que les articles) ; détail public via `ContentRenderer`, liste via `JobOffer::excerpt()`.
- Soft delete ; les candidatures historiques restent liées (`withTrashed` sur la relation).

### Candidatures

- Index : filtre `job_offer_id`, colonne offre.
- Show : bloc détail de l’offre liée.

## Fichiers clés

- `app/Models/JobOffer.php`
- `app/Actions/JobOffers/*`
- `app/Http/Controllers/Admin/JobOfferController.php`
- `app/Http/Controllers/Marketing/CareerController.php`
- `resources/js/pages/marketing/carrieres/`
- `resources/js/pages/offres-emploi/`
- `database/seeders/JobOfferSeeder.php` — 4 offres démo (maquette)
- `docs/features/candidatures-agents.md`

## Limites & dette

- Formulaires publics encore FR pour les messages de validation (dette i18n globale).
- Ancien enum `SecurityAgentPost` conservé pour l’historique ; nouvelles candidatures sans `post`.
