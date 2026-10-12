import { Head, usePage } from '@inertiajs/react';
import type { SeoSharedProps } from '@/types/seo';

type PageMeta = {
    title: string;
    description: string;
    canonical: string;
    robots: string;
    og_image: string;
    og_image_type: string;
    og_image_alt: string;
    og_type: string;
    hreflang?: Record<string, string>;
    og_locale?: string;
    og_locale_alternates?: string[];
};

type PageProps = {
    seo: SeoSharedProps;
    pageMeta: PageMeta | null;
};

export default function SeoHead() {
    const { seo, pageMeta } = usePage<PageProps>().props;

    if (!pageMeta) {
        return null;
    }

    const ogLocale = pageMeta.og_locale ?? seo.locale;
    const ogLocaleAlternates =
        pageMeta.og_locale_alternates ?? seo.localeAlternates ?? [];
    const hreflang = pageMeta.hreflang ?? {
        [seo.language]: pageMeta.canonical,
        'x-default': pageMeta.canonical,
    };

    return (
        <Head>
            <title head-key="title">{pageMeta.title}</title>
            <meta
                head-key="description"
                name="description"
                content={pageMeta.description}
            />
            <link head-key="canonical" rel="canonical" href={pageMeta.canonical} />
            {Object.entries(hreflang).map(([lang, href]) => (
                <link
                    key={lang}
                    head-key={`hreflang-${lang}`}
                    rel="alternate"
                    hrefLang={lang}
                    href={href}
                />
            ))}
            <meta head-key="robots" name="robots" content={pageMeta.robots} />
            <meta
                head-key="author"
                name="author"
                content={seo.organization.founder}
            />
            <meta
                head-key="copyright"
                name="copyright"
                content={seo.organization.name}
            />
            <meta head-key="geo.region" name="geo.region" content={seo.geo.region} />
            <meta
                head-key="geo.placename"
                name="geo.placename"
                content={seo.geo.placename}
            />
            {seo.organization.geoLatitude && (
                <meta
                    head-key="geo.position"
                    name="geo.position"
                    content={`${seo.organization.geoLatitude};${seo.organization.geoLongitude}`}
                />
            )}
            {seo.organization.geoLatitude && (
                <meta
                    head-key="ICBM"
                    name="ICBM"
                    content={`${seo.organization.geoLatitude}, ${seo.organization.geoLongitude}`}
                />
            )}

            <meta head-key="og:type" property="og:type" content={pageMeta.og_type} />
            <meta head-key="og:locale" property="og:locale" content={ogLocale} />
            {ogLocaleAlternates.map((alternate) => (
                <meta
                    key={alternate}
                    head-key={`og:locale:alternate:${alternate}`}
                    property="og:locale:alternate"
                    content={alternate}
                />
            ))}
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content={seo.siteName}
            />
            <meta head-key="og:title" property="og:title" content={pageMeta.title} />
            <meta
                head-key="og:description"
                property="og:description"
                content={pageMeta.description}
            />
            <meta head-key="og:url" property="og:url" content={pageMeta.canonical} />
            <meta head-key="og:image" property="og:image" content={pageMeta.og_image} />
            <meta
                head-key="og:image:width"
                property="og:image:width"
                content={String(seo.ogImage.width)}
            />
            <meta
                head-key="og:image:height"
                property="og:image:height"
                content={String(seo.ogImage.height)}
            />
            <meta
                head-key="og:image:type"
                property="og:image:type"
                content={pageMeta.og_image_type}
            />
            <meta
                head-key="og:image:alt"
                property="og:image:alt"
                content={pageMeta.og_image_alt}
            />

            <meta
                head-key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            {seo.twitterSite && (
                <meta
                    head-key="twitter:site"
                    name="twitter:site"
                    content={seo.twitterSite}
                />
            )}
            <meta
                head-key="twitter:title"
                name="twitter:title"
                content={pageMeta.title}
            />
            <meta
                head-key="twitter:description"
                name="twitter:description"
                content={pageMeta.description}
            />
            <meta
                head-key="twitter:image"
                name="twitter:image"
                content={pageMeta.og_image}
            />
            <meta
                head-key="twitter:image:alt"
                name="twitter:image:alt"
                content={pageMeta.og_image_alt}
            />
            <meta head-key="twitter:url" name="twitter:url" content={pageMeta.canonical} />
        </Head>
    );
}
