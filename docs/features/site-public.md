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

### Accueil et À propos — 28 octobre 2026

- Accueil ajusté à la maquette : engagements en colonne, bloc atouts en deux parties et sélection éditoriale « À la une » réunissant actualités et conseils publiés. État vide localisé si aucun contenu n’est transmis.
- À propos : présentation, engagements, approche, valeurs, organisation en trois étapes et application existante. Les six textes détaillés et leurs ancres sont conservés dans des rubriques dépliables ; la vidéo mise en avant conserve un aperçu et se charge à la demande lorsqu’elle possède une URL d’intégration.
- Navigation V2 commune à ces deux pages, avec état actif et menus Services/Ressources. Les autres pages conservent leur navigation jusqu’à leur refonte. Footer et menu mobile communs inchangés.
- FR/EN/zh préservés ; sur petit écran, photo et texte du hero sont séparés pour éviter la superposition sur le logo. Aucun voile supplémentaire sur les photos de hero.
- Deux visuels d’illustration générés via l’outil imagegen intégré : public/images/super-securite/about-v2-team.jpg et about-v2-supervision.jpg. L’image de l’application est conservée.

Consignes des deux visuels :

about-v2-team :
Use case: compositing. Extract and reconstruct ONLY the top HERO PHOTOGRAPH from image1 (the full website mockup). Image2 is the exact real logo. Create a wide 1896x760 photographic banner: Black African professional security supervisor seen from behind on the right, briefing a small mixed team of guards at a Guinea mining/industrial site, neutral gray-blue daylight sky, mining equipment softly visible behind. Apply exact white/red padlock-eye "Super Sécurité" logo from image2 to supervisor's back. Leave left40percent visually open for separately coded text. ONE smooth integrated navy side shadow on left fading to clear center; no extra overlay in code. Center/right remain bright, clear and neutral, no orange sunset. Match the top photo's composition and professional realism. Absolutely NO website interface, headline, button, frames or panels; only photograph. Do not reproduce the rest of image1's sections.

about-v2-supervision :
Use case: compositing. Image1 is the full website mockup; extract and reconstruct ONLY the control-room PHOTOGRAPH beside "Protéger, anticiper, accompagner". Image2 is the exact real white/red padlock-eye Super Sécurité logo. Output a clean landscape 1400x900 photo, no UI text or webpage panels. Black African security operator seen from behind/slight profile, black uniform and headset, seated at a professional security monitoring desk with multiple CCTV displays showing mine/construction entrance feeds in Guinea. Correct exact logo on uniform back, monitor content realistic with no gibberish branding. Neutral daylight/cool screen lighting, detailed but not too dark, whites neutral and no orange sunset. Focus on operator and equipment. No headlines, typography, button, watermark or invented software interface claims. This is an illustration for a corporate security webpage.


### Sécurité entreprise — 29 octobre 2026

- Page entreprise adaptée à la maquette 03 : hero clair, quatre engagements, présentation, six prestations, supervision, méthode, secteurs, FAQ et autres services. Les trois paragraphes métier, les six secteurs et les médias transmis par le backoffice sont conservés.
- Navigation V2 étendue uniquement à cette page service ; les trois autres pages services gardent leur rendu actuel. Footer et menu mobile communs conservés.
- Textes de l’interface ajoutés en français, anglais et chinois. FAQ dépliable au clavier ; liens localisés et galerie existante conservés.
- Visuels générés avec imagegen intégré : `public/images/super-securite/enterprise-v2-hero.jpg` et `enterprise-v2-entrance.jpg`. Supervision réutilisée depuis À propos. Le hero contient une seule ombre intégrée à gauche, sans voile CSS supplémentaire.

Consignes finales des visuels (références : maquette 03 et logo officiel blanc/rouge) :

Hero :
Use case: photorealistic-natural. Asset type: wide website hero photograph only, 1980x794 landscape. Reference image 1 is a complete website mockup: reproduce ONLY its top hero photographic scene, no interface, no headings or buttons. Reference image 2 is the exact Super Sécurité logo to embroider on the back of the guard's uniform, white padlock shackle, red lock with white eye, white words Super Sécurité. Modern glass corporate office entrance in Conakry Guinea, tropical greenery, white-red vehicle access barrier, professional Black African security guard in black uniform and cap viewed from back and slight side profile at the RIGHT third of frame, waist up, realistic radio, exact provided brand patch clearly visible on back. Another guard small in background at entrance. Bright neutral daylight, pale blue sky, cool natural balanced colors, visible architecture. Keep left half mostly office facade with a SINGLE soft navy shadow baked into the photograph at left for future white copy. Right side clear and luminous. No red sky, no orange grading, no night, no weapons, no shield logo, no watermark, no website text. Photorealistic natural corporate editorial photography.

Entrée :
Use case: photorealistic-natural. Asset type: landscape corporate website editorial photograph, 1400x1000. Reference image1 is the full website mockup; recreate ONLY the large photograph in the second section showing an office lobby entrance and security guard, no UI. Reference image2 is exact white/red padlock-eye Super Sécurité logo to apply faithfully on guard back. Black African professional security guard in black cap and black uniform seen from back/three-quarter profile on left, checking access at a bright modern glass corporate office lobby in Conakry Guinea. Office visitor in background, tropical landscaping visible through glass, clean reception barrier. Exact white words Super Sécurité beside white shackle red lock white eye on back patch, no shield. Natural bright neutral daylight, balanced cool colors, realistic materials and facial anatomy. No dark overlay, no red/orange sky, no warm grading, no weapons, no website text/buttons/watermark. Only photograph.

Validation : 302 assertions de rendu Accueil/À propos/Entreprise et composants V2, 66 assertions de localisation publique, TypeScript, ESLint ciblé et compilation réussis. Contrôle navigateur entreprise à 1440, 1024, 768, 390 et 320 px : une seule h1, aucune image manquante ni débordement, FAQ au clavier et ouverture de la galerie validées, aucune erreur JavaScript observée.


### Résidence, Chantiers et Zones minières — 29 octobre 2026

- Les trois pages utilisent la navigation V2 et leurs maquettes respectives : visuels par activité, quatre engagements, prestations existantes, bloc métier, méthode, secteurs, FAQ et services associés. La page minière conserve ses six arguments détaillés ; les chantiers conservent les indicateurs de prestation dans le bloc organisation.
- Les contenus et les galeries publiés restent prioritaires. Les images de repli résidentielles HEIC sont remplacées par leurs JPEG déjà présents pour une lecture dans les navigateurs.
- Les textes spécifiques sont disponibles en français, anglais et chinois sous services_v2. Le rendu service est partagé entre les quatre activités, avec les mêmes liens localisés et le footer commun.
- Sept illustrations générées avec l’outil imagegen intégré et converties en JPEG dans public/images/super-securite/. Les photos de contexte opérationnel et les galeries existantes sont conservées. Chaque hero a une seule ombre intégrée à gauche, sans voile ajouté par le code.

Consignes des visuels (références : maquettes 04/05/06 et logo officiel blanc/rouge) :

residence-v2-hero.jpg :
Use case: photorealistic-natural. Asset type: wide website hero photograph 1980x794 landscape. Image1 is website mockup: recreate ONLY its top hero photograph, no UI. Image2 exact real Super Sécurité white/red padlock-eye logo. Scene: modern elegant private residential gated compound in Conakry Guinea, cream stone entrance, black gate, tropical palms, white/red vehicle access barrier, discreet dark SUV and resident in background. Professional Black African security guard wearing black cap and black uniform with radio, back and three-quarter profile toward left, positioned at RIGHT third. Apply exact provided logo clearly on back: white shackle, red lock with white eye, white words Super Sécurité, no shield. Bright neutral daylight, natural cool balanced tones, pale blue-gray sky, no orange sunset or red sky. Left half open for separately coded headline, ONE soft navy side shadow baked into left of photo fading to clear center, right clear and luminous. Photorealistic editorial photography. No website lettering, headings, buttons, watermark or weapons.

residence-v2-detail.jpg :
Use case: photorealistic-natural. Asset type: landscape editorial photograph, 1400x1000. Reference1 is website mockup: recreate ONLY its large introductory photograph below the hero, no interface. Reference2 exact real white/red padlock-eye Super Sécurité logo to reproduce faithfully on guard back or chest. A professional Black African security guard checking visitor access at an elegant private residence gate with intercom in Conakry Guinea. A female resident is speaking with him, respectful discreet interaction, cream stone wall, tropical greenery. Composition guard at left, environmental context to right, realistic human proportions. Bright neutral daylight, balanced cool natural colors, clear image without any shadow overlay. Exact white shackle, red lock with white eye and white words Super Sécurité, no shield. No red sky, no orange grading, no weapons, no website text, no buttons, no watermark. Photograph only.

chantiers-v2-hero.jpg :
Use case: photorealistic-natural. Asset type: wide website hero photograph 1980x794 landscape. Image1 is website mockup: recreate ONLY its top hero photograph, no UI. Image2 exact real Super Sécurité white/red padlock-eye logo. Scene: active building construction site in Conakry Guinea, reinforced concrete building, cranes, orderly materials, distant workers with safety helmets and white delivery truck. Professional Black African security guard wearing black cap and black uniform with radio, back and three-quarter profile toward left, positioned at RIGHT third. Apply exact provided logo clearly on back: white shackle, red lock with white eye, white words Super Sécurité, no shield. Bright neutral daylight, natural cool balanced tones, pale blue-gray sky, no orange sunset or red sky. Left half open for separately coded headline, ONE soft navy side shadow baked into left of photo fading to clear center, right clear and luminous. Photorealistic editorial photography. No website lettering, headings, buttons, watermark or weapons.

chantiers-v2-detail.jpg :
Use case: photorealistic-natural. Asset type: landscape editorial photograph, 1400x1000. Reference1 is website mockup: recreate ONLY its large introductory photograph below the hero, no interface. Reference2 exact real white/red padlock-eye Super Sécurité logo to reproduce faithfully on guard back or chest. A professional Black African security guard checking a delivery truck driver's paperwork at a construction entrance in Conakry Guinea, concrete building and cranes in background, distant workers with helmets, guard wearing black cap and uniform. Composition guard at left, environmental context to right, realistic human proportions. Bright neutral daylight, balanced cool natural colors, clear image without any shadow overlay. Exact white shackle, red lock with white eye and white words Super Sécurité, no shield. No red sky, no orange grading, no weapons, no website text, no buttons, no watermark. Photograph only.

zones-minieres-v2-hero.jpg :
Use case: photorealistic-natural. Asset type: wide website hero photograph 1980x794 landscape. Image1 is website mockup: recreate ONLY its top hero photograph, no UI. Image2 exact real Super Sécurité white/red padlock-eye logo. Scene: large open pit mining site in Guinea, gray rocky hills, massive yellow haul trucks on left, white security pickup on far right and small Guinea flag. Professional Black African security guard wearing black cap and black uniform with radio, back and three-quarter profile toward left, positioned at RIGHT third. Apply exact provided logo clearly on back: white shackle, red lock with white eye, white words Super Sécurité, no shield. Bright neutral daylight, natural cool balanced tones, pale blue-gray sky, no orange sunset or red sky. Left half open for separately coded headline, ONE soft navy side shadow baked into left of photo fading to clear center, right clear and luminous. Photorealistic editorial photography. No website lettering, headings, buttons, watermark or weapons.

zones-minieres-v2-detail.jpg :
Use case: photorealistic-natural. Asset type: landscape editorial photograph, 1400x1000. Reference1 is website mockup: recreate ONLY its large introductory photograph below the hero, no interface. Reference2 exact real white/red padlock-eye Super Sécurité logo to reproduce faithfully on guard back or chest. A professional Black African security guard in black cap and uniform using a radio while patrolling a large Guinea mining installation, steel conveyors and ore-processing structures in background, second guard distant, safe separated pedestrian area. Composition guard at left, environmental context to right, realistic human proportions. Bright neutral daylight, balanced cool natural colors, clear image without any shadow overlay. Exact white shackle, red lock with white eye and white words Super Sécurité, no shield. No red sky, no orange grading, no weapons, no website text, no buttons, no watermark. Photograph only.


residence-v2-evening.jpg :
Use case: photorealistic-natural. Asset type: landscape corporate website photo 1500x850. Reference1 full residential security website mockup: reproduce ONLY the twilight residential entrance photograph beside the text Discrétion, vigilance et confiance, no UI. Reference2 exact white/red padlock-eye Super Sécurité logo. Elegant modern residential apartment/villa compound in Conakry Guinea, warm interior lights with cool blue early evening sky, cream stone entrance gatehouse, palms and trimmed planting, white/red barrier, one Black African guard in black uniform seen from behind at right with exact white/red logo on back. Architecture and gate take most of frame, guard small contextual. Bright readable dusk, professional natural photography, no dark overlay, no red sky, no sunset orange color cast, no weapons, no webpage headings/buttons/watermark.

Validation des trois services : 746 assertions de rendu V2 et 66 assertions de localisation publique, TypeScript, ESLint ciblé et compilation réussis. Contrôle navigateur à 1440, 1024, 768, 390 et 320 px pour chaque page : une seule h1, aucune image manquante ni débordement horizontal. Les interactions de FAQ au clavier et de galerie sont conservées. Aperçus ordinateur et mobile dans storage/app/previews/{residence,chantiers,zones-minieres}-v2-*.png.
