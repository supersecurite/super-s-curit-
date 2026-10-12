# Site public marketing

**Statut :** ✅ Complet (i18n phase 1)

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

## Limites & dette (phase 2)

- Backoffice UI non traduit.
- Pas de traduction éditoriale articles / conseils (bandeau « contenu FR » sous `/en`).
- Segments d’URL encore en français sous `/en/...` (`/en/a-propos`).
