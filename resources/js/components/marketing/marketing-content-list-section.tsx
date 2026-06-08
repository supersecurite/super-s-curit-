import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import MarketingContentPreviewCard from '@/components/marketing/marketing-content-preview-card';
import Reveal from '@/components/marketing/reveal';
import type { MarketingContentPreview } from '@/types/marketing-content';

type MarketingContentListSectionProps = {
    id?: string;
    label: string;
    title: string;
    description: string;
    indexHref: string;
    indexLabel: string;
    items: MarketingContentPreview[];
    itemHref: (slug: string) => string;
    readLabel: string;
    fallbackIcon: LucideIcon;
};

export default function MarketingContentListSection({
    id,
    label,
    title,
    description,
    indexHref,
    indexLabel,
    items,
    itemHref,
    readLabel,
    fallbackIcon,
}: MarketingContentListSectionProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section id={id} className="py-10 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <p className="marketing-label mb-2 sm:mb-3">{label}</p>
                        <h2 className="marketing-heading-section">{title}</h2>
                        <p className="mt-3 text-sm leading-relaxed text-super-securite-muted md:text-base">
                            {description}
                        </p>
                    </div>
                    <Link
                        href={indexHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-super-securite-accent transition-colors hover:text-super-securite-heading"
                    >
                        {indexLabel}
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                </Reveal>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <Reveal key={item.id} delay={index * 80}>
                            <MarketingContentPreviewCard
                                item={item}
                                href={itemHref(item.slug)}
                                readLabel={readLabel}
                                fallbackIcon={fallbackIcon}
                            />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
