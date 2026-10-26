# Site public marketing

**Statut :** ✅ Complet (i18n phase 2 — backoffice UI + CMS éditorial)

## Vue d’ensemble

Site vitrine Super Sécurité : accueil, services, à propos, galerie, actualités, conseils, contact, devenir agent, légal / privacy.

**Bilingue FR (défaut) + EN** — [ADR-0005](../decisions/0005-i18n-public-url-prefix.md).

## Acteurs & rôles

Visiteurs anonymes. Tracking visites actif (hors pages exclues).

## Fonctionnement

- Layout `marketing-layout` + `useVisitTracker`.
- Locale dérivée de l’URL (`/` = FR, `/en/...` = EN) via `SetLocaleFromUrl`.
- Traductions UI : `lang/fr.json` + `lang/en.json`, partagées Inertia (`locale`, `translations`), hook `useTrans()` / `tNode()`.
- Héros pages + carrousel home + why-us + valeurs + pages services : hooks `useMarketingPageHero`, `useMarketingHeroSlides`, `useWhyUsContent`, `useLocalizedServicePage` (dont highlights zones minières).
- Accueil : partenaires (marquee), atouts (« Our strengths »), teaser app.
- Contact : canaux, formulaire, carte, FAQ groupées — clés `contact.*` dans les JSON.
- Switcher FR | EN : navigation vers l’URL équivalente (+ cookie `locale` mémorisé, sans soft-redirect SEO).
- Contenu dynamique : articles/conseils publiés (corps FR), logos partenaires, galerie.
- Contact POST : `ContactController@store` (aussi sous `/en/contact`).
- SEO : méta par locale (`config/seo.php` + `config/seo_en.php`), hreflang, `og:locale`, sitemap bilingue pour pages statiques ; articles/conseils uniquement en FR dans le sitemap.

## Fichiers clés

- `routes/web.php` + `App\Support\RegisterMarketingPublicRoutes`
- `config/locales.php`, `config/seo_en.php`
- `app/Support/LocaleUrl.php`, `app/Http/Middleware/SetLocaleFromUrl.php`
- `app/Seo/LocalizedSeo.php`, `SeoPageRegistry`, `SitemapEntries`
- `resources/js/hooks/use-trans.ts`, `use-localized-url.ts`
- `resources/js/lib/locale-url.ts`
- `resources/js/pages/marketing/`
- `resources/js/layouts/marketing-layout.tsx`
- `resources/js/components/marketing/`

## Limites & dette

- Backoffice bilingue : toasts `bt()`, messages Form Requests, UI via `lang/{locale}/backoffice.json` + `useTrans` — [ADR-0006](../decisions/0006-backoffice-locale-session.md).
- Segments d’URL encore en français sous `/en/...` (`/en/a-propos`) — hors phase 2.
- Formulaires publics (contact, devenir agent) : messages de validation encore FR (hors périmètre BO).

- Changement de langue principale du navigateur : la sélection précédente est invalidée à la prochaine requête. Accueil FR/EN négocié automatiquement ; pages publiques statiques redirigées lors du changement détecté. Le backoffice suit le changement en session.

- Chinois simplifié (zh) : URLs /zh, sélecteurs public et backoffice, catalogues complets, métadonnées et FAQ. Les contenus éditoriaux sans version chinoise restent en français avec un bandeau. Le choix automatique conserve la règle FR si navigateur français, EN sinon. Composants partagés : recherche, dialogues, galerie, éditeur, formulaires et sécurité du compte traduits FR/EN/ZH.

- Les listes/détails actualités et conseils, filtres, liens similaires, retours et partages conservent la langue. Galerie : compteurs et filtres traduits. Contact : soumission, validation et confirmation localisées.
