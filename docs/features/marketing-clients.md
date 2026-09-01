# Marketing — clients & listes

**Statut :** 🔲 À construire — **Lot 1** du [cahier des charges client](../CAHIER%20DES%20CHARGES.md)

## Vue d’ensemble

CRM léger pour le futur module marketing : contacts clients (e-mail, téléphone WhatsApp) et listes / audiences, avec import CSV.

## Acteurs & rôles (prévu)

- Rôle `commercial` + admins avec permissions `marketing.*` — [ADR-0001](../decisions/0001-role-commercial.md).

## Fonctionnement (prévu)

1. CRUD contact (nom, e-mail, téléphone E.164, tags optionnels, consentement).
2. Listes : création, ajout / retrait de contacts.
3. Import CSV (mapping colonnes, rapport d’erreurs).
4. Déduplication e-mail / téléphone.

## Fichiers clés

Aucun backend encore. À créer sous une future arborescence `Marketing/` (controllers, models `MarketingContact`, `MarketingList`, …).

## Limites & dette

- Spécification alignée CDC §5.1 — voir [ROADMAP.md](../ROADMAP.md) §4.1.
- Consentement RGPD / opt-out à traiter avant envois en masse.
