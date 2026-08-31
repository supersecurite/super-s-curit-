# Décisions d’architecture (ADR) — Super Sécurité

Ce dossier contient les **Architecture Decision Records** : décisions d’architecture ou compromis produit non triviaux, actés et datés.

## Quand créer une ADR

- Plusieurs alternatives raisonnables, une retenue durablement.
- Contrainte produit qui limite volontairement une fonctionnalité.
- Impact multi-modules ou risque de re-discuter sans contexte écrit.

Pas d’ADR pour un bugfix, un ajustement UI mineur, ou une convention déjà actée.

## Gabarit

Fichier : `NNNN-titre-court-en-kebab-case.md`

```markdown
# ADR-NNNN : Titre

## Status
Accepted | Superseded by ADR-XXXX | Deprecated

## Date
AAAA-MM-JJ

## Context
…

## Decision
…

## Alternatives Considered
### Alternative A
- Pros / Cons / Rejected because

## Consequences
…
```

## Index

| ADR | Titre | Statut |
|---|---|---|
| [0001](0001-role-commercial.md) | Introduction du rôle `commercial` | Accepted |
| [0002](0002-marketing-meta-whatsapp-et-email.md) | Marketing e-mail + WhatsApp Meta Cloud API + accusés | Accepted |
