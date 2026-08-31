# Candidatures agents

**Statut :** ✅ Complet

## Vue d’ensemble

Formulaire public « Devenir agent » + backoffice de suivi (statut, notes internes).

## Acteurs & rôles

- Public : soumission throttlée.
- Backoffice : `agent_applications.view` / `agent_applications.update`.

## Fonctionnement

- Public : create / store / merci.
- Admin : index, show ; formulaire de suivi masqué si pas `canUpdate`.

## Fichiers clés

- `app/Http/Controllers/Marketing/SecurityAgentApplicationController.php`
- `app/Http/Controllers/Admin/SecurityAgentApplicationController.php`
- `app/Policies/SecurityAgentApplicationPolicy.php`
- `resources/js/pages/candidatures-agents/`
- `resources/js/pages/marketing/` (devenir-agent)

## Limites & dette

- Pas de notification e-mail documentée comme obligatoire à chaque candidature.
