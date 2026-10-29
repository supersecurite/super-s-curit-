/** Render real public pages against each catalog; external widgets are inert. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
let props;
const cache = new Map();
function native(tag) {
    return function Widget({ children, asChild, ...attributes }) {
        if (typeof children === 'function')
            children = children({ processing: false, errors: {} });
        if (asChild) return children;
        delete attributes.variant;
        delete attributes.size;
        delete attributes.resetOnSuccess;
        return React.createElement(tag, attributes, children);
    };
}
const blank = () => null;
const icon = () => React.createElement('span', { 'aria-hidden': true });
const inertia = {
    usePage: () => ({ props }),
    router: { get() {} },
    Head: blank,
    Link: native('a'),
    Form: native('form'),
};
const realComponents = new Set([
    '@/components/marketing/marketing-content-filters',
    '@/components/marketing/resources-v2-header',
    '@/components/marketing/resource-v2-detail',
    '@/components/lexical-editor/content-renderer',
    '@/components/marketing/contact-form',
    '@/components/content-share-button',
    '@/components/content-share-links',
    '@/components/marketing/cms-locale-notice',
]);
function load(specifier, parent = root) {
    if (specifier === '@inertiajs/react') return inertia;
    if (specifier === 'lucide-react') return new Proxy({}, { get: () => icon });
    if (specifier === 'sonner') return { toast: { success() {}, error() {} } };
    if (specifier === 'framer-motion')
        return {
            AnimatePresence: native('div'),
            motion: new Proxy({}, { get: () => native('div') }),
        };
    if (specifier === '@/hooks/use-marketing-page-hero')
        return {
            useMarketingPageHero: (key) => ({
                label: props.translations.heroes[key]?.label ?? key,
            }),
        };
    if (specifier === '@/components/marketing/gallery-lightbox')
        return { useGalleryLightbox: () => ({ openAt() {}, lightbox: null }) };
    if (specifier === '@/components/ui/searchable-select')
        return {
            SearchableSelect: ({ options, value }) =>
                React.createElement(
                    'select',
                    { value, readOnly: true },
                    options.map((o) =>
                        React.createElement(
                            'option',
                            { key: o.value, value: o.value },
                            o.label,
                        ),
                    ),
                ),
        };
    if (
        specifier.startsWith('@/components/') &&
        !realComponents.has(specifier)
    ) {
        let widget = native('div');
        if (specifier.endsWith('/input')) widget = native('input');
        if (specifier.endsWith('/textarea')) widget = native('textarea');
        if (specifier.endsWith('/label')) widget = native('label');
        if (specifier.endsWith('/button')) widget = native('button');
        if (specifier.endsWith('/recaptcha-field')) widget = blank;
        return new Proxy(
            { __esModule: true, default: widget },
            { get: (target, key) => (key in target ? target[key] : widget) },
        );
    }
    if (specifier === '@/lib/utils')
        return {
            cn: (...values) =>
                values.filter((v) => typeof v === 'string').join(' '),
        };
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
        file = ['.ts', '.tsx', '/index.ts', '/index.tsx']
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
function render(file) {
    return renderToStaticMarkup(
        React.createElement(load('@/pages/marketing/' + file).default),
    );
}
let assertions = 0;
for (const locale of ['fr', 'en', 'zh']) {
    const translations = JSON.parse(
        fs.readFileSync(path.join(root, 'lang', locale + '.json')),
    );
    const prefix = locale === 'fr' ? '' : '/' + locale;
    const item = {
        id: 1,
        title: 'Sample',
        slug: 'sample',
        excerpt: 'Example',
        image_url: null,
        category: null,
        featured: false,
        views: 4,
        read_time: 2,
        formatted_read_time: '2 min de lecture',
        published_at_formatted: null,
        is_locale_fallback: false,
    };
    props = {
        locale,
        translations,
        locales: ['fr', 'en', 'zh'],
        articles: { data: [item], current_page: 1, last_page: 1, links: [] },
        featuredArticles: [],
        categories: [],
        filters: {},
        securityTips: {
            data: [item],
            current_page: 1,
            last_page: 1,
            links: [],
        },
        featuredSecurityTips: [],
        article: item,
        articleContent: JSON.stringify({
            root: {
                children: [
                    {
                        type: 'heading',
                        tag: 'h2',
                        children: [
                            { type: 'text', text: 'Actual content heading' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            { type: 'text', text: 'Actual published body' },
                        ],
                    },
                ],
            },
        }),
        relatedArticles: [{ ...item, id: 2, slug: 'related' }],
        securityTip: item,
        securityTipContent: JSON.stringify({
            root: {
                children: [
                    {
                        type: 'heading',
                        tag: 'h2',
                        children: [
                            { type: 'text', text: 'Actual content heading' },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            { type: 'text', text: 'Actual published body' },
                        ],
                    },
                ],
            },
        }),
        relatedSecurityTips: [{ ...item, id: 2, slug: 'related' }],
    };
    for (const [file, section] of [
        ['articles', 'actualites'],
        ['conseils-securite', 'conseils-securite'],
    ]) {
        let html = render(file + '/index');
        assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
        assertions++;
        assert.ok(html.includes(translations.resources_v2.title_lead));
        assertions++;
        assert.ok(html.includes('aria-current="page"'));
        assertions++;
        for (const target of [
            '/actualites',
            '/conseils-securite',
            '/galerie',
        ]) {
            assert.ok(html.includes('href="' + prefix + target + '"'));
            assertions++;
        }

        assert.ok(
            html.includes(translations.public_content.read),
            locale + ': read button',
        );
        assertions++;
        assert.ok(
            html.includes('href="' + prefix + '/' + section + '/sample"'),
            locale + ': localized detail link',
        );
        assertions++;
        assert.ok(
            html.includes(translations.ui.newest),
            locale + ': translated sort',
        );
        assertions++;
        assert.ok(
            html.includes(
                translations[file === 'articles' ? 'articles' : 'tips']
                    .search_placeholder,
            ),
            locale + ': search',
        );
        assertions++;
        html = render(file + '/show');
        assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
        assertions++;
        assert.ok(html.includes('Actual published body'));
        assertions++;
        assert.ok(html.includes('Actual content heading'));
        assertions++;
        assert.ok(html.includes(translations.resources_v2.contact_title));
        assertions++;
        assert.ok(html.includes('resource-v2-sidebar'));
        assertions++;

        assert.ok(
            html.includes(
                translations.public_content[
                    file === 'articles' ? 'back_articles' : 'back_tips'
                ],
            ),
            locale + ': back label',
        );
        assertions++;
        assert.ok(
            html.includes('href="' + prefix + '/' + section + '"'),
            locale + ': back link',
        );
        assertions++;
        assert.ok(
            html.includes(
                translations.public_content[
                    file === 'articles' ? 'related_articles' : 'related_tips'
                ],
            ),
            locale + ': related heading',
        );
        assertions++;
        assert.ok(
            html.includes(translations.share.copy_link),
            locale + ': share label',
        );
        assertions++;
        assert.ok(
            html.includes(
                encodeURIComponent(prefix + '/' + section + '/sample'),
            ),
            locale + ': localized shared URL',
        );
        assertions++;
    }
    Object.assign(props, {
        images: [],
        videos: [],
        services: [{ value: 'entreprise', label: 'Sécurité entreprise' }],
        countsByService: {},
        countsVideosByService: {},
        filters: { service: 'all' },
    });
    const gallery = render('gallery/index');
    assert.equal((gallery.match(/<h1[ >]/g) || []).length, 1);
    assertions++;
    assert.ok(gallery.includes(translations.resources_v2.gallery_title));
    assertions++;
    assert.ok(gallery.includes('aria-pressed="true"'));
    assertions++;
    assert.ok(gallery.includes('<select'));
    assertions++;

    assert.ok(
        gallery.includes(translations.galerie.no_photos),
        locale + ': gallery empty message',
    );
    assertions++;
    assert.ok(
        gallery.includes(translations.services.entreprise.title),
        locale + ': gallery service label',
    );
    assertions++;
    Object.assign(props, {
        flash: {},
        recaptcha: { enabled: false, siteKey: null, language: 'fr' },
    });
    const form = renderToStaticMarkup(
        React.createElement(
            load('@/components/marketing/contact-form').default,
        ),
    );
    assert.ok(
        form.includes('action="' + prefix + '/contact"'),
        locale + ': form action',
    );
    assertions++;
    assert.ok(
        form.includes(translations.contact.form_submit),
        locale + ': contact submit',
    );
    assertions++;
}
console.log(assertions + ' public rendering assertions passed (FR/EN/ZH).');
