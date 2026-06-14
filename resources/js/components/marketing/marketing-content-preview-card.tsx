import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MarketingContentPreview } from '@/types/marketing-content';

type MarketingContentPreviewCardProps = {
    item: MarketingContentPreview;
    href: string;
    readLabel: string;
    fallbackIcon: LucideIcon;
};

export default function MarketingContentPreviewCard({
    item,
    href,
    readLabel,
    fallbackIcon: FallbackIcon,
}: MarketingContentPreviewCardProps) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl bg-super-securite-surface shadow-md shadow-slate-900/5 transition-shadow duration-200 hover:shadow-lg hover:shadow-slate-900/10">
            <div className="relative aspect-video overflow-hidden">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-super-securite-surface-elevated">
                        <FallbackIcon className="size-10 text-super-securite-muted" />
                    </div>
                )}
                {item.category ? (
                    <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {item.category}
                    </span>
                ) : null}
            </div>

            <div className="p-6">
                <div className="mb-3 flex items-center gap-3 text-sm text-super-securite-muted">
                    {item.published_at_formatted ? (
                        <span className="flex items-center gap-1">
                            <Calendar className="size-4" aria-hidden />
                            {item.published_at_formatted}
                        </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                        <Clock className="size-4" aria-hidden />
                        {item.read_time} min
                    </span>
                </div>

                <h3 className="mb-3 line-clamp-2 font-heading text-lg font-semibold text-super-securite-heading transition-colors group-hover:text-super-securite-accent">
                    {item.title}
                </h3>

                {item.excerpt ? (
                    <p className="mb-4 line-clamp-3 text-sm text-super-securite-muted">
                        {item.excerpt}
                    </p>
                ) : null}

                <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-super-securite-accent"
                >
                    {readLabel}
                    <ArrowRight className="size-4" aria-hidden />
                </Link>
            </div>
        </article>
    );
}
