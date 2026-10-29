const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
let pageProps;
let pageComponent = 'marketing/home';
let pageUrl = '/';
const cache = new Map();
const blank = () => null;
const Link = ({ children, ...attributes }) =>
    React.createElement('a', attributes, children);
function load(specifier, parent = root) {
    if (specifier === 'lucide-react')
        return load(require.resolve('lucide-react'));
    if (specifier === '@inertiajs/react')
        return {
            usePage: () => ({
                props: pageProps,
                url: pageUrl,
                component: pageComponent,
            }),
            Link,
            router: { visit() {} },
        };
    if (specifier === '@/components/marketing/marketing-mobile-nav')
        return {
            __esModule: true,
            default: () =>
                React.createElement(
                    'button',
                    {
                        className: 'xl:hidden p-2 text-white',
                        'aria-label': 'Menu',
                    },
                    '☰',
                ),
        };
    if (specifier === '@/components/marketing/marketing-language-select')
        return {
            __esModule: true,
            default: () =>
                React.createElement(
                    'button',
                    {
                        className:
                            'home-v2-language rounded border px-2 hidden sm:flex',
                    },
                    pageProps.locale + ' ⌄',
                ),
        };
    if (
        specifier.startsWith('@/components/') &&
        !specifier.endsWith('/home-v2-header') &&
        !specifier.endsWith('/marketing-footer') &&
        !specifier.endsWith('/home-v2-resource-highlights') &&
        !specifier.endsWith('/service-gallery') &&
        !specifier.endsWith('/gallery-lightbox') &&
        !specifier.endsWith('/reveal') &&
        !specifier.startsWith('@/components/marketing/service-layouts') &&
        specifier !== '@/components/ui/dropdown-menu'
    )
        return new Proxy(
            { __esModule: true, default: blank },
            { get: (o, k) => (k in o ? o[k] : blank) },
        );
    if (
        !specifier.startsWith('@/') &&
        !specifier.startsWith('.') &&
        !path.isAbsolute(specifier)
    )
        return require(specifier);
    let file = specifier.startsWith('@/')
        ? path.join(root, 'resources/js', specifier.slice(2))
        : path.resolve(parent, specifier);
    if (!path.extname(file))
        file = ['.ts', '.tsx', '/index.ts']
            .map((ext) => file + ext)
            .find(fs.existsSync);
    assert.ok(file, 'Module exists: ' + specifier);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            jsx: ts.JsxEmit.ReactJSX,
            target: ts.ScriptTarget.ES2022,
            esModuleInterop: true,
        },
    }).outputText;
    vm.runInThisContext(
        '(function(require,module,exports){' + source + '\n})',
        { filename: file },
    )((name) => load(name, path.dirname(file)), module, module.exports);
    return module.exports;
}
function render(
    locale,
    partners = [],
    companyOverrides = {},
    page = 'home',
    extraProps = {},
) {
    pageComponent = 'marketing/' + page;
    pageUrl =
        (locale === 'fr' ? '' : '/' + locale) +
        (page === 'about'
            ? '/a-propos'
            : page === 'service-page'
              ? '/' + (extraProps.serviceId || 'entreprise')
              : '/');
    pageProps = {
        locale,
        locales: ['fr', 'en', 'zh'],
        translations: JSON.parse(
            fs.readFileSync(path.join(root, 'lang', locale + '.json')),
        ),
        partners,
        ...extraProps,
        superSecurite: {
            phone: '+224 612 13 13 14',
            phone_href: 'tel:+224612131314',
            phone_secondary: '+224 612 13 13 15',
            email: 'contact@supersecurite.com',
            address:
                'Lambanyi (en face de Cis Media) – Conakry – Rép. de Guinée',
            social: {
                linkedin: 'https://www.linkedin.com/company/super-securite/',
                facebook: 'https://www.facebook.com/supersecurite',
                instagram: 'https://www.instagram.com/supersecurite',
                youtube: null,
                twitter: null,
            },
            ...companyOverrides,
        },
    };
    const Home = load('@/pages/marketing/' + page).default;
    const Header = load('@/components/marketing/home-v2-header').default;
    const Footer = load('@/components/marketing/marketing-footer').default;
    return renderToStaticMarkup(
        React.createElement(
            React.Fragment,
            null,
            React.createElement(Header),
            React.createElement(Home),
            React.createElement(Footer),
        ),
    );
}
let checks = 0;
for (const locale of ['fr', 'en', 'zh']) {
    const html = render(locale);
    const prefix = locale === 'fr' ? '' : '/' + locale;
    const copy = pageProps.translations.home_v2;
    for (const text of [
        copy.title_lead,
        copy.title_accent,
        copy.quote_cta,
        copy.why_title,
        ...copy.values.map((x) => x.title),
    ]) {
        assert.ok(html.includes(text), locale + ': ' + text);
        checks++;
    }
    for (const page of [
        'entreprise',
        'residence',
        'chantiers',
        'zones-minieres',
        'contact',
    ]) {
        assert.ok(
            html.includes('href="' + prefix + '/' + page + '"'),
            locale + ': ' + page,
        );
        checks++;
    }
    const footer = html.slice(html.indexOf('<footer'));
    for (const key of [
        'presence_title',
        'project_title',
        'links_title',
        'resources',
        'privacy',
    ]) {
        assert.ok(
            footer.includes(pageProps.translations.footer_v2[key]),
            locale + ': footer ' + key,
        );
        checks++;
    }
    for (const page of [
        'actualites',
        'conseils-securite',
        'galerie',
        'devenir-agent',
        'mentions-legales',
        'politique-de-confidentialite',
    ]) {
        assert.ok(
            footer.includes('href="' + prefix + '/' + page + '"'),
            locale + ': footer route ' + page,
        );
        checks++;
    }
    assert.ok(
        footer.includes('mailto:contact@supersecurite.com') &&
            footer.includes('tel:+224612131314'),
    );
    checks++;
    assert.ok(
        footer.includes('aria-label="LinkedIn"') &&
            !footer.includes('aria-label="YouTube"'),
    );
    checks++;
    assert.ok(footer.includes('rel="noopener noreferrer"'));
    checks++;
    assert.ok(footer.includes(String(new Date().getFullYear())));
    checks++;
    assert.equal((html.match(/<h1 /g) || []).length, 1);
    checks++;
    assert.ok(!html.includes('500+') && !html.includes('100+'));
    checks++;
    for (const image of [...html.matchAll(/src="(\/images\/[^"]+)"/g)]) {
        assert.ok(fs.existsSync(path.join(root, 'public', image[1])), image[1]);
        checks++;
    }
}
const override = render('fr', [
    { name: 'CMS Partner', logo: '/custom-logo.png' },
]);
assert.ok(
    override.includes('alt="CMS Partner"') &&
        !override.includes('alt="AKIBA FINANCE"'),
);
checks++;
const noNetworks = render('fr', [], { social: {} });
assert.ok(!noNetworks.includes('class="marketing-footer-socials"'));
checks++;

for (const locale of ['fr', 'en', 'zh']) {
    const html = render(locale, [], {}, 'about');
    const copy = pageProps.translations.about_v2;
    for (const text of [
        copy.title_lead,
        copy.title_accent,
        copy.approach_lead,
        copy.method_title,
        copy.tools_title,
        ...copy.values.map((item) => item.title),
    ]) {
        assert.ok(html.includes(text), locale + ': about ' + text);
        checks++;
    }
    assert.equal((html.match(/<h1 /g) || []).length, 1);
    checks++;
    for (const id of [
        'agrement',
        'agents',
        'supervision',
        'application',
        'reactivite',
        'expertise',
    ]) {
        assert.ok(
            html.includes('id="' + id + '"'),
            locale + ': preserved ' + id,
        );
        checks++;
    }
    assert.ok(!html.includes('<iframe'));
    checks++;
    for (const image of [...html.matchAll(/src="(\/images\/[^"]+)"/g)]) {
        assert.ok(fs.existsSync(path.join(root, 'public', image[1])), image[1]);
        checks++;
    }
    const prefix = locale === 'fr' ? '' : '/' + locale;
    assert.ok(
        html.includes(
            'href="' +
                prefix +
                '/a-propos" class="home-v2-nav-link is-active" aria-current="page"',
        ),
    );
    checks++;
}
const withVideo = render('fr', [], {}, 'about', {
    featuredVideo: {
        title: 'Présentation vidéo',
        embed_url: 'https://www.youtube-nocookie.com/embed/example',
    },
});
assert.ok(
    withVideo.includes('class="about-v2-video-poster"') &&
        withVideo.includes('Présentation vidéo'),
);
checks++;
const news = {
    id: 42,
    title: 'Actualité publiée',
    slug: 'actualite-publiee',
    excerpt: 'Une nouvelle du terrain.',
    image_url: null,
    category: 'Terrain',
    read_time: 3,
    published_at_formatted: null,
};
const tip = {
    ...news,
    id: 43,
    title: 'Conseil publié',
    slug: 'conseil-publie',
};
const editorial = render('en', [], {}, 'home', {
    featuredArticles: [news],
    featuredSecurityTips: [tip, { ...tip, id: 44, slug: 'autre-conseil' }],
});
for (const href of [
    '/en/actualites/actualite-publiee',
    '/en/conseils-securite/conseil-publie',
    '/en/conseils-securite/autre-conseil',
]) {
    assert.ok(editorial.includes('href="' + href + '"'));
    checks++;
}
assert.equal(
    (editorial.match(/class="home-v2-resource-card"/g) || []).length,
    3,
);
checks++;
assert.ok(
    render('fr').includes(pageProps.translations.home_v2.resources_empty),
);
checks++;

for (const locale of ['fr', 'en', 'zh']) {
    const faqs = [
        { question: 'Test FAQ ' + locale, answer: 'Test response ' + locale },
    ];
    const html = render(locale, [], {}, 'service-page', {
        serviceId: 'entreprise',
        pageFaqs: faqs,
        galleryImages: [],
        galleryVideos: [],
    });
    const copy = pageProps.translations.enterprise_v2;
    const prefix = locale === 'fr' ? '' : '/' + locale;
    for (const text of [
        copy.title_lead,
        copy.title_accent,
        copy.perimeter,
        copy.supervision_title,
        copy.method_title,
        copy.faq_title,
        copy.related_title,
        ...copy.benefits.map((x) => x.title),
        ...copy.steps.map((x) => x.title),
        ...pageProps.translations.services.entreprise.sections.map(
            (x) => x.title,
        ),
        faqs[0].question,
        faqs[0].answer,
    ]) {
        assert.ok(
            html.includes(text.replaceAll('&', '&amp;')),
            locale + ' enterprise: ' + text,
        );
        checks++;
    }
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    checks++;
    for (const path of [
        '/contact',
        '/a-propos',
        '/residence',
        '/chantiers',
        '/zones-minieres',
    ]) {
        assert.ok(html.includes('href="' + prefix + path + '"'));
        checks++;
    }
    assert.ok(html.includes('home-v2-header-solid'));
    checks++;
    assert.ok(html.includes('enterprise-v2-hero.jpg'));
    checks++;
    assert.ok(!html.includes('enterprise_v2.'));
    checks++;
    const noFaq = render(locale, [], {}, 'service-page', {
        serviceId: 'entreprise',
        pageFaqs: [],
        galleryImages: [],
        galleryVideos: [],
    });
    assert.ok(!noFaq.includes('class="enterprise-v2-faq"'));
    checks++;
}

for (const locale of ['fr', 'en', 'zh']) {
    for (const serviceId of ['residence', 'chantiers', 'zones-minieres']) {
        const prefix = locale === 'fr' ? '' : '/' + locale;
        const html = render(locale, [], {}, 'service-page', {
            serviceId,
            pageFaqs: [
                { question: 'FAQ-' + serviceId, answer: 'Answer-' + serviceId },
            ],
            galleryImages: [],
            galleryVideos: [],
        });
        const copy = pageProps.translations.services_v2[serviceId];
        const service = pageProps.translations.services[serviceId];
        for (const text of [
            copy.title_lead,
            copy.title_accent,
            copy.intro_title,
            copy.supervision_title,
            copy.method_title,
            copy.sectors_title,
            ...copy.benefits.map((x) => x.title),
            ...copy.steps.map((x) => x.title),
            ...service.sections.flatMap((x) => [x.title, x.description]),
            ...service.intro,
            ...service.intro_indicators,
            ...(service.highlights || []),
            'FAQ-' + serviceId,
            'Answer-' + serviceId,
        ]) {
            const escaped = text
                .replaceAll('&', '&amp;')
                .replaceAll("'", '&#x27;')
                .replaceAll('"', '&quot;');
            assert.ok(
                html.includes(escaped),
                locale + ' ' + serviceId + ': ' + text,
            );
            checks++;
        }
        assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
        checks++;
        assert.ok(html.includes('service-v2-' + serviceId));
        checks++;
        assert.ok(html.includes(serviceId + '-v2-hero.jpg'));
        checks++;
        assert.ok(html.includes('home-v2-header-solid'));
        checks++;
        assert.ok(!html.includes('services_v2.'));
        checks++;
        assert.ok(!html.includes('.heic'));
        checks++;
        for (const id of [
            'entreprise',
            'residence',
            'chantiers',
            'zones-minieres',
        ].filter((id) => id !== serviceId)) {
            assert.ok(html.includes('href="' + prefix + '/' + id + '"'));
            checks++;
        }
        assert.ok(html.includes('href="' + prefix + '/contact"'));
        checks++;
        const media = render(locale, [], {}, 'service-page', {
            serviceId,
            pageFaqs: [],
            galleryImages: [
                {
                    id: 1,
                    src: '/images/custom-' + serviceId + '.jpg',
                    alt: 'Published media ' + serviceId,
                    caption: null,
                },
            ],
            galleryVideos: [],
        });
        assert.ok(media.includes('/images/custom-' + serviceId + '.jpg'));
        checks++;
        assert.ok(!media.includes('class="enterprise-v2-faq"'));
        checks++;
    }
}

console.log(
    checks +
        ' home, about, all services and shared V2 rendering checks passed.',
);
if (process.argv.includes('--preview')) {
    const manifest = JSON.parse(
        fs.readFileSync(path.join(root, 'public/build/manifest.json')),
    );
    const styles = Object.entries(manifest)
        .filter(([key]) => key.endsWith('.css'))
        .map(
            ([, entry]) =>
                '<link rel="stylesheet" href="/build/' + entry.file + '">',
        )
        .join('');
    const html =
        '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
        styles +
        '<style>' +
        [
            'home-v2',
            'marketing-footer',
            'marketing-mobile-nav',
            'marketing-pages-v2',
        ]
            .map((name) =>
                fs.readFileSync(
                    path.join(root, 'resources/css', name + '.css'),
                    'utf8',
                ),
            )
            .join('\n') +
        '</style></head><body><div class="marketing-site">' +
        render('fr') +
        '</div></body></html>';
    fs.writeFileSync(
        path.join(root, 'storage/app/previews/home-v2.html'),
        html,
    );
}
