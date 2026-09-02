# Marketing — clients & listes

**Statut :** ✅ Livré — **Lot 1** du [cahier des charges client](../CAHIER%20DES%20CHARGES.md)

## Vue d’ensemble

CRM léger pour le module marketing : contacts clients (e-mail, téléphone WhatsApp) et listes / audiences, avec import CSV.

## Acteurs & rôles

- Rôle `commercial` + admins avec permissions `marketing_clients.*` — [ADR-0001](../decisions/0001-role-commercial.md).
- Permission dédiée à l’import : `marketing_clients.import`.

## Fonctionnement

1. **Contacts** (`/marketing-clients`) — CRUD : type **particulier / entreprise** (`is_company`), prénom, nom, e-mail, téléphone international (interlocuteur principal), nom de l'entreprise, **rôle de l'interlocuteur** (`company_role`), **canaux entreprise JSON plats** (`company_contacts` : `{ type, value, label }` pour `email` / `phone` / `whatsapp`), adresse, tags, consentement, notes. À la **création**, association optionnelle à un ou plusieurs **groupes** (`list_uuids`). Le formulaire masque les champs entreprise si `is_company` est faux. Résolution campagne via `MarketingContact::campaignChannels()` et `ResolveMarketingContactChannels` (destinataires, CC e-mail entreprise).
2. **Listes / groupes** (`/marketing-lists`) — fiche détail (contacts, actions) + page d’édition des infos séparée. Ajout de **plusieurs contacts** en une fois depuis la fiche groupe.
3. **Import CSV** (`/marketing-clients/import`) — colonnes reconnues : `prenom`, `nom`, `email`, `telephone`, `entreprise`, `role_entreprise`, `contacts_entreprise` (**JSON plat**), `adresse`, `consentement` ; modèle téléchargeable ; rapport ajouts / doublons / erreurs. Format legacy imbriqué (interlocuteurs + `channels`) accepté à l'import et normalisé.
4. **UI** — max 3 actions principales par page ; confirmations (suppression, ajout/retrait contact) en modales.
5. **Déduplication** — unicité e-mail et téléphone en base ; doublons ignorés à l’import.

## Architecture

Mutations métier via **Actions** ([ADR-0003](../decisions/0003-actions-clean-architecture.md)) :

| Action | Rôle |
|---|---|
| `CreateMarketingContact` | Création contact |
| `UpdateMarketingContact` | Mise à jour contact |
| `DeleteMarketingContact` | Suppression contact |
| `ImportMarketingContacts` | Import CSV (délègue au service) |
| `CreateMarketingList` | Création liste |
| `UpdateMarketingList` | Mise à jour liste |
| `DeleteMarketingList` | Suppression liste |
| `AttachContactToMarketingList` | Ajout d'un contact à une liste |
| `AttachContactsToMarketingList` | Ajout de plusieurs contacts à une liste |
| `DetachContactFromMarketingList` | Retrait contact d'une liste |

Toasts : `Inertia::flash('toast', …)` sur toutes les mutations.

## Fichiers clés

| Couche | Fichier |
|---|---|
| Modèles | `app/Models/MarketingContact.php`, `MarketingList.php` |
| Actions | `app/Actions/Marketing/` |
| Policies | `app/Policies/MarketingContactPolicy.php`, `MarketingListPolicy.php` |
| Import (technique) | `app/Services/Marketing/MarketingContactImportService.php` |
| Canaux campagne | `app/Support/Marketing/ResolveMarketingContactChannels.php`, `MarketingCompanyContactRules.php`, `app/Enums/MarketingCompanyContactChannel.php` |
| Contrôleurs | `app/Http/Controllers/Admin/MarketingContactController.php`, `MarketingListController.php` |
| Pages | `resources/js/pages/marketing-clients/`, `marketing-lists/` |
| Tests | `tests/Feature/MarketingContactTest.php`, `MarketingListTest.php` |
| Seeder | `database/seeders/MarketingSeeder.php` — contacts, groupes, templates, campagnes réalistes (Conakry) |

## Limites & dette

- Consentement RGPD / opt-out global à traiter avant envois en masse (Lots 2–3).
- Pas de segmentation avancée ni de scoring — hors périmètre Lot 1.
