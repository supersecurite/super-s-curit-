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
- Rouge du thème conservé ; variante rouge sombre déjà existante pour le contraste des petits CTA. Une seule ombre douce est intégrée directement à la photo, à gauche derrière le titre et à droite derrière les engagements. Aucun voile CSS ni élément de superposition du hero ; le centre, le logo et le ciel restent clairs.
- Header spécifique à l'accueil, superposé à la photo avec un dégradé bleu nuit assombri, légèrement translucide et plus transparent à droite. Il reste sticky, avec liens localisés, sélecteur de langue et navigation mobile jusqu'au breakpoint xl. Les autres pages conservent leur header.
- Services, photos de cartes et partenaires existants réutilisés ; aucun effectif, nombre de clients ou ancienneté non confirmé ajouté.
- Traductions FR/EN/zh via home_v2 ; les contenus éditoriaux reçus par l'accueil restent disponibles.
- Tests : tests/Frontend/home-v2.cjs, rendu aux largeurs 320/390/1280/1536 et contrôles TypeScript/build. L'aperçu isolé ne remplace pas un test avec la base métier active.

Visuel actif : public/images/super-securite/home-v2-hero-daylight-shaded.jpg, retouché avec l’outil imagegen intégré à partir du précédent visuel, du logo fourni et de la maquette utilisateur. Lumière naturelle neutre, ciel clair, ombres débouchées ; logo blanc et rouge intégré au dos de l’agent, puis ombre latérale unique intégrée au fichier image. Illustration promotionnelle. Le visuel précédent est conservé sous home-v2-hero.jpg.

Consignes utilisées avec l’outil intégré :

Retouche lumière et logo :

Use case: compositing.
Asset type: wide photographic website hero background, approximately 1896 x 830, landscape 2.28:1.
Input images: Image 1 is the existing hero PHOTO TO EDIT. Image 2 is the exact Super Sécurité LOGO to insert. Image 3 is a website MOCKUP used ONLY as the lighting, exposure and neutral color grading reference for its top photographic scene; do not copy its UI, gold branding, texts or panels.
Primary request: Correct the actual photograph in Image 1, which is much too dark and orange. Match the visibly lighter, neutral daylight and pale gray-blue/ivory overcast sky in the top photo of Image 3. Remove ALL orange/red sunset color cast from the sky, rocks, ground and skin. Lift shadow detail naturally so the mining site, trucks, uniform fabric, face and pickup remain clearly visible. The overall photograph must be visibly brighter, naturally exposed and less contrasty than Image 1. Soft diffused daylight, neutral/cool gray-blue highlights, muted stone colors, realistic black/navy uniform. No golden-hour, amber, orange, red or dramatic cinematic sunset look. No dark vignette or dark baked-in gradient on the left; leave the left third compositionally open for separately coded text while showing naturally lit terrain.
Logo edit: Apply the exact supplied Image 2 logo prominently to the large upper/middle BACK panel of the foreground officer's tactical vest, physically following the back's perspective and fabric. Preserve the white padlock shackle, RED padlock with white eye symbol, and bold WHITE words on two lines exactly "Super" and "Sécurité". Match the supplied logo proportions and typography as closely as possible, retaining the accent on Sécurité. It must read clearly and look like a realistic professional uniform print or patch, large enough to see at website size. Do not add a black rectangular image background behind the logo.
Invariants: keep the same Black African officer identity, back-facing pose, cap, radio, uniform silhouette, red uniform details, mining site, mining vehicles, Guinean flag, white patrol pickup, and current wide composition. Keep all objects in their existing positions. Do not include website UI, headlines, buttons, gold emblems, new watermarks, or extra logos on the pickup. Only correct photographic lighting/color/exposure and insert the supplied back logo. Opaque photographic background.

Finition avec ombre unique intégrée à la photo :

Use case: precise-object-edit.
Asset type: final website hero photograph, same wide 1896 x 830 composition.
Edit target: Image 1 is the newly corrected daylight hero with the correct Super Sécurité logo already on the officer's back. Image 2 is the client's website mockup, used ONLY to match the LEFT AND RIGHT SOFT SHADOW placement in its top hero photograph. Do not copy any UI, lettering, buttons, gold logos or service panels.
Primary request: Add ONE single integrated, continuous, soft photographic navy shadow/vignette treatment directly into Image 1, with the two sides shaded for website copy, matching the top hero in Image 2. On the LEFT, darken the mining truck and foreground/rocks behind where the headline and description will be placed, strongest at the left edge and fading smoothly toward the officer. The leftmost 35 percent needs rich dark navy shadows but the truck must remain recognizable with visible details. On the far RIGHT, shade the foreground pickup and background behind the future right-hand feature list; darken the outermost 18-20 percent enough for small white overlay text to read well. Both shaded sides must be part of ONE smooth continuous vignette inside the actual photograph, with no abrupt edge, no black rectangle, no visible panel, and no multiple stacked effects.
Very important invariants: Keep the center of the scene, the main officer, the exact white/red "Super Sécurité" back logo, and the pale gray-blue daylight sky bright, neutral and unchanged. Preserve the corrected natural daylight color balance. Do NOT restore orange/red sunset, amber warmth or dark cinematic grading across the whole photo. Keep the camera framing, scene, subject identity, pose, objects and exact logo unchanged. The central 45-75 percent region must retain the current clear exposure and logo visibility. Keep the upper strip of sky open and light toward the middle/right for a separately coded translucent menu. No overall dimming of the whole photograph. Only add the smooth side shading described, baked into this one final image. Do not render UI or text beyond the existing uniform logo.

### Layout public et footer V2 — 27 octobre 2026

- Footer commun à toutes les pages publiques : bandeau de présence en Guinée, silhouette du pays, encart de devis, puis logo, liens utiles, quatre services et coordonnées.
- Ressources regroupe les liens Actualités, Conseils et Galerie dans un groupe déroulant accessible ; les routes éditoriales existantes sont conservées à cette étape.
- Coordonnées et réseaux issus de la configuration partagée ; aucun réseau non configuré affiché. Liens internes et nouvelles interfaces traduits FR/EN/zh.
- Version mobile empilée, focus clavier visibles et liens légaux dans la barre inférieure ; le copyright suit l’année courante.
- Silhouette géographique issue des données publiques Natural Earth 1:110m (https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson).

- Menu mobile V2 commun : panneau bleu nuit, six rubriques, Services et Ressources dépliables selon la page active, langue avec drapeaux et bouton de devis. Navigation clavier, fermeture Escape/clic lien et retour du focus via Radix Sheet ; contenu défilant et CTA fixe adaptés aux petits écrans.
