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

### Accueil V2 — 27 octobre 2026

- Nouvelle composition basée sur la maquette client : hero panoramique, quatre cartes métier, panneau d'engagements, partenaires et bloc « Pourquoi nous choisir ».
- Rouge du thème conservé ; variante rouge sombre déjà existante pour le contraste des petits CTA.
- Header spécifique à l'accueil, liens localisés, sélecteur de langue conservé et navigation mobile disponible jusqu'au breakpoint xl. Les autres pages conservent leur header.
- Services, photos de cartes et partenaires existants réutilisés ; aucun effectif, nombre de clients ou ancienneté non confirmé ajouté.
- Traductions FR/EN/zh via home_v2 ; les contenus éditoriaux reçus par l'accueil restent disponibles.
- Tests : tests/Frontend/home-v2.cjs, rendu aux largeurs 320/390/1280/1536 et contrôles TypeScript/build. L'aperçu isolé ne remplace pas un test avec la base métier active.

Visuel : public/images/super-securite/home-v2-hero.jpg, généré avec l'outil imagegen intégré à partir de la référence utilisateur. Illustration promotionnelle.

Consigne finale utilisée pour le visuel :
Use case: compositing. Create ONLY the wide photographic hero background from the top hero scene in this reference, suitable for a 16:7 website banner, no UI, no lettering, no logos, no captions or buttons. A Black African private security officer viewed from behind, dark professional uniform and cap with subtle red accents and radio, centered slightly right, monitoring a Guinea open-pit mining site, mining trucks in the distance, a white patrol pickup on the far right. Cinematic realistic photography, warm late-afternoon sky, dark navy shadows. Preserve the reference composition and professional mood. Leave the left third mostly clear dark navy space for separately coded white and RED headline. Replace the gold security branding accents with RED. This is a promotional illustration, not a UI screenshot.