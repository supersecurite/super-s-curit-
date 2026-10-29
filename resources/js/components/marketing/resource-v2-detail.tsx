import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import ContentShareLinks from '@/components/content-share-links';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
import MarketingContentImage from '@/components/marketing/marketing-content-image';
import ResourcesV2Header from '@/components/marketing/resources-v2-header';
import type { ResourceSection } from '@/components/marketing/resources-v2-header';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';
import type { MarketingContentImageSource } from '@/types/marketing-content';

type ResourceItem = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    image_source?: MarketingContentImageSource | null;
    published_at_formatted: string | null;
};
type ResourceDetail = ResourceItem & {
    category: string | null;
    read_time: number;
    views: number;
};
type Props = {
    kind: Exclude<ResourceSection, 'gallery'>;
    item: ResourceDetail;
    content: string | null;
    related: ResourceItem[];
};

function ResourceSidebar({
    content,
    item,
    url,
}: {
    content: string | null;
    item: ResourceDetail;
    url: string;
}) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const [headings, setHeadings] = useState<
        Array<{ id: string; text: string }>
    >([]);
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            const nodes = document.querySelectorAll<HTMLElement>(
                '#resource-v2-content h2, #resource-v2-content h3',
            );
            setHeadings(
                Array.from(nodes)
                    .map((node, index) => {
                        node.id ||= 'resource-section-' + index;

                        return { id: node.id, text: node.textContent || '' };
                    })
                    .filter((node) => node.text),
            );
        });

        return () => cancelAnimationFrame(frame);
    }, [content]);

    return (
        <aside className="resource-v2-sidebar">
            {headings.length > 0 && (
                <nav aria-label={t('resources_v2.contents')}>
                    <h2>{t('resources_v2.contents')}</h2>
                    <ol>
                        {headings.map((heading) => (
                            <li key={heading.id}>
                                <a href={'#' + heading.id}>{heading.text}</a>
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            <div className="resource-v2-share">
                <h2>{t('resources_v2.share')}</h2>
                <ContentShareLinks
                    title={item.title}
                    url={url}
                    description={item.excerpt}
                    variant="marketing"
                />
            </div>
            <div className="resource-v2-contact">
                <h2>{t('resources_v2.contact_title')}</h2>
                <p>{t('resources_v2.contact_text')}</p>
                <Link className="home-v2-button" href={lp('/contact')}>
                    {t('resources_v2.contact_cta')}
                    <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </div>
        </aside>
    );
}

/** Lecture V2 : contenu éditorial réel, sommaire construit depuis ses titres et partage. */
export default function ResourceV2Detail({
    kind,
    item,
    content,
    related,
}: Props) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();
    const indexPath = kind === 'news' ? '/actualites' : '/conseils-securite';
    const backLabel = t(
        kind === 'news'
            ? 'public_content.back_articles'
            : 'public_content.back_tips',
    );
    const itemUrl = lp(indexPath + '/' + encodeURIComponent(item.slug));

    return (
        <div className="resources-v2 resource-v2-detail">
            <ResourcesV2Header active={kind} compact />
            <section
                className={
                    'resource-v2-detail-hero' +
                    (!item.image_url ? ' is-empty' : '')
                }
            >
                <div className="resource-v2-detail-intro">
                    <Link className="resource-v2-back" href={lp(indexPath)}>
                        <ArrowLeft size={17} aria-hidden="true" />
                        {backLabel}
                    </Link>
                    {item.category && (
                        <p className="resource-v2-detail-category">
                            {item.category}
                        </p>
                    )}
                    <h1>{item.title}</h1>
                    <div className="resource-v2-metadata">
                        {item.published_at_formatted && (
                            <span>
                                <Calendar size={15} aria-hidden="true" />
                                {item.published_at_formatted}
                            </span>
                        )}
                        <span>
                            <Clock size={15} aria-hidden="true" />
                            {t('public_content.reading', {
                                count: item.read_time,
                            })}
                        </span>
                        <span>
                            <Eye size={15} aria-hidden="true" />
                            {t('public_content.views', { count: item.views })}
                        </span>
                    </div>
                </div>
                {item.image_url && (
                    <MarketingContentImage
                        src={item.image_url}
                        source={item.image_source}
                        alt={item.title}
                        className="resource-v2-detail-photo"
                    />
                )}
            </section>
            <div className="resources-v2-container resource-v2-reading-grid">
                <article id="resource-v2-content">
                    {item.excerpt && (
                        <p className="resource-v2-excerpt">{item.excerpt}</p>
                    )}
                    <ContentRenderer content={content} />
                    <Link
                        className="resource-v2-back resource-v2-back-bottom"
                        href={lp(indexPath)}
                    >
                        <ArrowLeft size={17} aria-hidden="true" />
                        {backLabel}
                    </Link>
                </article>
                <ResourceSidebar content={content} item={item} url={itemUrl} />
            </div>
            {related.length > 0 && (
                <section className="resources-v2-container resource-v2-related">
                    <h2 className="resource-v2-section-title">
                        {t(
                            kind === 'news'
                                ? 'public_content.related_articles'
                                : 'public_content.related_tips',
                        )}
                    </h2>
                    <div className="resource-v2-related-grid">
                        {related.map((other) => (
                            <Link
                                className="resource-v2-card"
                                key={other.id}
                                href={lp(
                                    indexPath +
                                        '/' +
                                        encodeURIComponent(other.slug),
                                )}
                            >
                                {other.image_url && (
                                    <MarketingContentImage
                                        src={other.image_url}
                                        source={other.image_source}
                                        alt={other.title}
                                        className="resource-v2-related-photo"
                                    />
                                )}
                                <div className="p-5">
                                    <h3>{other.title}</h3>
                                    {other.excerpt && <p>{other.excerpt}</p>}
                                    <span className="resource-v2-read">
                                        {t('public_content.read')}
                                        <ArrowRight
                                            size={16}
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
