/** Vérifie que les liens Lexical et le markdown legacy deviennent des ancres cliquables. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');
const cache = new Map();

function load(specifier, parent = root) {
    if (specifier === 'react' || specifier === 'react/jsx-runtime') {
        return require(specifier);
    }

    if (specifier === '@/hooks/use-trans') {
        return {
            useTrans: () => ({
                t: (_key, fallback) => fallback ?? _key,
            }),
        };
    }

    let resolved = specifier;
    if (specifier.startsWith('@/')) {
        resolved = path.join(root, 'resources/js', specifier.slice(2));
    } else if (specifier.startsWith('.')) {
        resolved = path.resolve(path.dirname(parent), specifier);
    }

    const candidates = [
        resolved,
        `${resolved}.tsx`,
        `${resolved}.ts`,
        `${resolved}.jsx`,
        `${resolved}.js`,
        path.join(resolved, 'index.tsx'),
        path.join(resolved, 'index.ts'),
    ];
    const file = candidates.find((candidate) => fs.existsSync(candidate));
    assert.ok(file, `Module introuvable: ${specifier}`);

    if (cache.has(file)) {
        return cache.get(file);
    }

    const source = fs.readFileSync(file, 'utf8');
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            jsx: ts.JsxEmit.ReactJSX,
            target: ts.ScriptTarget.ES2020,
            esModuleInterop: true,
        },
        fileName: file,
    });

    const module = { exports: {} };
    const dirname = path.dirname(file);
    const requireFn = (request) => load(request, file);
    cache.set(file, module.exports);
    vm.runInNewContext(
        outputText,
        {
            module,
            exports: module.exports,
            require: requireFn,
            __dirname: dirname,
            __filename: file,
            console,
            React,
        },
        { filename: file },
    );
    cache.set(file, module.exports);

    return module.exports;
}

const ContentRenderer = load(
    '@/components/lexical-editor/content-renderer',
).default;

function render(content) {
    return renderToStaticMarkup(
        React.createElement(ContentRenderer, { content }),
    );
}

const lexicalLink = JSON.stringify({
    root: {
        children: [
            {
                type: 'paragraph',
                children: [
                    { type: 'text', text: 'Consultez ' },
                    {
                        type: 'link',
                        url: 'https://example.com/docs',
                        children: [{ type: 'text', text: 'notre guide' }],
                    },
                    { type: 'text', text: '.' },
                ],
            },
        ],
    },
});

const markdownLegacy = JSON.stringify({
    root: {
        children: [
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        text: 'Voir [le site](https://supersecurite.com) maintenant.',
                    },
                ],
            },
        ],
    },
});

const lexicalHtml = render(lexicalLink);
assert.match(
    lexicalHtml,
    /href="https:\/\/example\.com\/docs"/,
    'Le nœud link Lexical doit produire une ancre',
);
assert.match(
    lexicalHtml,
    /notre guide/,
    'Le libellé du lien Lexical doit être conservé',
);
assert.match(
    lexicalHtml,
    /target="_blank"/,
    'Les liens http doivent s’ouvrir dans un nouvel onglet',
);

const markdownHtml = render(markdownLegacy);
assert.match(
    markdownHtml,
    /href="https:\/\/supersecurite\.com"/,
    'Le markdown legacy [texte](url) doit devenir une ancre',
);
assert.match(
    markdownHtml,
    />le site</,
    'Le libellé markdown doit être conservé',
);
assert.doesNotMatch(
    markdownHtml,
    /\[le site\]\(https:\/\/supersecurite\.com\)/,
    'Le markdown brut ne doit plus apparaître tel quel',
);

console.log('content-renderer-links: ok');
