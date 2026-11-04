# Candidatures agents

**Statut :** ✅ Complet (étendu — liées aux offres Carrières)

## Vue d’ensemble

Candidatures issues de la page Carrières (`/carrieres/{slug}/postuler`). Chaque nouvelle candidature est liée à une `JobOffer`. Le backoffice permet le suivi (statut, notes internes) et le filtre par offre.

## Acteurs & rôles

- Public : soumission throttlée via une offre active.
- Backoffice : `agent_applications.view` / `agent_applications.update`.

## Fonctionnement

- Public : store via `SubmitJobApplication` + e-mail RH + page merci.
- Admin : index (filtres statut / offre / localisation / search), show, update statut + notes.
- Historique : candidatures sans `job_offer_id` (avant module Carrières) restent consultables ; libellé poste via enum legacy.

## Fichiers clés

- `app/Http/Controllers/Marketing/CareerController.php`
- `app/Actions/JobOffers/SubmitJobApplication.php`
- `app/Http/Controllers/Admin/SecurityAgentApplicationController.php`
- `app/Policies/SecurityAgentApplicationPolicy.php`
- `resources/js/pages/candidatures-agents/`
- `resources/js/pages/marketing/carrieres/`

## Limites & dette

- Pas de pièce jointe CV.
- Validation formulaires publics encore FR (dette i18n).
