import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import type { MarketingContentPreview } from '@/types/marketing-content';

type Props = {
    articles: MarketingContentPreview[];
    tips: MarketingContentPreview[];
};

/** Sélection éditoriale de contenus publiés fournis par le serveur, sans contenu fictif. */
export default function HomeV2ResourceHighlights({ articles, tips }: Props) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const selectedArticles = articles.slice(0, tips.length ? 2 : 3);
    const entries = [
        ...selectedArticles.map((item) => ({ item, kind: 'article' as const })),
        ...tips
            .slice(0, 3 - selectedArticles.length)
            .map((item) => ({ item, kind: 'tip' as const })),
    ];

    return (
        <section className="home-v2-latest" aria-labelledby="home-latest-title">
            <div className="home-v2-latest-heading">
                <h2 id="home-latest-title">{t('home_v2.latest_title')}</h2>
                <Link
                    href={lp('/actualites')}
                    className="home-v2-resources-link"
                >
                    {t('home_v2.resources_cta')}
                    <ArrowRight size={17} aria-hidden="true" />
                </Link>
            </div>
            {entries.length ? (
                <div className="home-v2-resource-grid">
                    {entries.map(({ item, kind }) => {
                        const href = lp(
                            (kind === 'article'
                                ? '/actualites/'
                                : '/conseils-securite/') +
                                encodeURIComponent(item.slug),
                        );
                        const readLabel = t(
                            kind === 'article' ? 'articles.read' : 'tips.read',
                        );

                        return (
                            <article
                                className="home-v2-resource-card"
                                key={kind + item.id}
                            >
                                <Link
                                    href={href}
                                    className="home-v2-resource-image"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                >
                                    <img
                                        src={
                                            item.image_url ||
                                            '/images/super-securite/agents-super-securite-ronde-site-exterieur.jpeg'
                                        }
                                        alt=""
                                        width={620}
                                        height={360}
                                        loading="lazy"
                                    />
                                </Link>
                                <div className="home-v2-resource-body">
                                    <span className="home-v2-resource-category">
                                        {item.category ||
                                            t(
                                                kind === 'article'
                                                    ? 'nav.news'
                                                    : 'footer.tips',
                                            )}
                                    </span>
                                    <h3>
                                        <Link href={href}>{item.title}</Link>
                                    </h3>
                                    {item.excerpt && <p>{item.excerpt}</p>}
                                    <Link
                                        href={href}
                                        className="home-v2-text-link"
                                        aria-label={
                                            readLabel + ' — ' + item.title
                                        }
                                    >
                                        {readLabel}
                                        <ArrowRight
                                            size={15}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <p className="home-v2-resource-empty">
                    {t('home_v2.resources_empty')}
                </p>
            )}
        </section>
    );
}
