import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Eye, Shield } from 'lucide-react';
import type { ReactNode } from 'react';
import ContentShareButton from '@/components/content-share-button';
import MarketingContentImage from '@/components/marketing/marketing-content-image';
import { useTrans } from '@/hooks/use-trans';
import type { MarketingContentImageSource } from '@/types/marketing-content';

export type ResourceV2CardItem = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    image_source?: MarketingContentImageSource | null;
    category: string | null;
    views: number;
    read_time: number;
    published_at_formatted: string | null;
};

type ResourceV2CardProps = {
    item: ResourceV2CardItem;
    href: string;
    emptyMedia?: ReactNode;
};

/** Carte éditoriale partagée actualités / conseils sur les listes Ressources V2. */
export default function ResourceV2Card({
    item,
    href,
    emptyMedia,
}: ResourceV2CardProps) {
    const { t } = useTrans();

    return (
        <article className="resource-v2-card group">
            <div className="relative aspect-video overflow-hidden">
                {item.image_url ? (
                    <MarketingContentImage
                        src={item.image_url}
                        source={item.image_source}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-super-securite-surface-elevated">
                        {emptyMedia ?? (
                            <span className="text-sm text-super-securite-muted">
                                Super Sécurité
                            </span>
                        )}
                    </div>
                )}
                {item.category ? (
                    <span className="resource-v2-category absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {item.category}
                    </span>
                ) : null}
            </div>

            <div className="p-6">
                <div className="mb-3 flex items-center gap-3 text-sm text-super-securite-muted">
                    {item.published_at_formatted ? (
                        <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {item.published_at_formatted}
                        </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {t('public_content.minutes', {
                            count: item.read_time,
                        })}
                    </span>
                </div>

                <h3 className="mb-3 line-clamp-2 font-heading text-xl font-semibold text-super-securite-heading transition-colors group-hover:text-super-securite-accent">
                    {item.title}
                </h3>

                {item.excerpt ? (
                    <p className="mb-4 line-clamp-3 text-sm text-super-securite-muted">
                        {item.excerpt}
                    </p>
                ) : null}

                <div className="flex items-center justify-between border-t border-super-securite-border pt-4">
                    <span className="flex items-center gap-1 text-sm text-super-securite-muted">
                        <Eye className="size-4" />
                        {item.views}
                    </span>
                    <div className="flex items-center gap-1">
                        <ContentShareButton
                            title={item.title}
                            url={href}
                            description={item.excerpt}
                            variant="marketing"
                        />
                        <Link
                            href={href}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-super-securite-accent"
                        >
                            {t('public_content.read')}
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

export function ResourceV2ShieldPlaceholder() {
    return <Shield className="size-10 text-super-securite-muted" />;
}
