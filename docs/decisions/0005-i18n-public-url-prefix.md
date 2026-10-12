# ADR-0005 — i18n site public : préfixe URL `/en`

**Statut :** Accepté  
**Date :** 2026-10-12

## Contexte

Le site marketing doit être bilingue FR / EN avec un SEO correct (URLs distinctes, hreflang, sitemap). Les approches session-only (ex. ORVITA) ne suffisent pas pour Google.

## Décision

| Choix | Valeur |
|---|---|
| Langues | `fr` (défaut) + `en` |
| URLs FR | Sans préfixe (`/`, `/contact`, …) pour préserver le ranking existant |
| URLs EN | Préfixe `/en` (`/en`, `/en/contact`, …) |
| Segments de path | Conservés en FR en phase 1 (`/en/a-propos`) |
| Contenu CMS | Articles / conseils restent en FR ; accessibles sous `/en/...` avec bandeau + méta EN générique |
| Sitemap | Pages statiques / services / légales en FR + EN ; articles / conseils uniquement en FR |
| Switcher | Navigation Inertia vers l’URL équivalente (pas un POST session) |
| Soft redirect cookie | Désactivé (évite les surprises SEO) |

## Conséquences

- Middleware `SetLocaleFromUrl` sur les routes marketing uniquement.
- Traductions UI via `lang/{locale}.json` partagées Inertia (`locale`, `translations`).
- Meta SEO EN dans `config/seo_en.php`, mergées par `LocalizedSeo`.
- Phase 2 : backoffice bilingue ([ADR-0006](0006-backoffice-locale-session.md)), traductions éditoriales CMS, segments d’URL traduits si besoin.
