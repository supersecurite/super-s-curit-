const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
let pageProps;
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
                url: '/',
                component: 'marketing/home',
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
        !specifier.endsWith('/home-v2-header')
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
function render(locale, partners = []) {
    pageProps = {
        locale,
        locales: ['fr', 'en', 'zh'],
        translations: JSON.parse(
            fs.readFileSync(path.join(root, 'lang', locale + '.json')),
        ),
        partners,
        superSecurite: { phone: '+224', social: {} },
    };
    const Home = load('@/pages/marketing/home').default;
    const Header = load('@/components/marketing/home-v2-header').default;
    return renderToStaticMarkup(
        React.createElement(
            React.Fragment,
            null,
            React.createElement(Header),
            React.createElement(Home),
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
console.log(checks + ' home V2 rendering checks passed.');
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
        fs.readFileSync(path.join(root, 'resources/css/home-v2.css'), 'utf8') +
        '</style></head><body><div class="marketing-site">' +
        render('fr') +
        '</div></body></html>';
    fs.writeFileSync(
        path.join(root, 'storage/app/previews/home-v2.html'),
        html,
    );
}
