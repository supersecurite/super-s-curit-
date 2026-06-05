import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, Shield } from 'lucide-react';
import {
    index as conseilsIndex,
    show as conseilsShow,
} from '@/routes/conseils-securite';

type FeaturedSecurityTip = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    category: string | null;
    read_time: number;
    published_at_formatted: string | null;
};

type SecurityTipsSectionProps = {
    tips: FeaturedSecurityTip[];
};

export default function SecurityTipsSection({
    tips,
}: SecurityTipsSectionProps) {
    if (tips.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-20">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-super-securite-accent mb-2 text-sm font-semibold uppercase tracking-wider">
                            Conseils de sécurité
                        </p>
                        <h2 className="marketing-heading-section">
                            Protégez ce qui compte
                        </h2>
                        <p className="text-super-securite-muted mt-3 max-w-2xl text-sm md:text-base">
                            Des recommandations pratiques pour renforcer la
                            sécurité de vos locaux, événements et équipes.
                        </p>
                    </div>
                    <Link
                        href={conseilsIndex.url()}
                        className="text-super-securite-accent inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-super-securite-heading"
                    >
                        Voir tous les conseils
                        <ArrowRight className="size-4" />
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {tips.map((tip) => (
                        <article
                            key={tip.id}
                            className="marketing-card-interactive group overflow-hidden p-0"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                {tip.image_url ? (
                                    <img
                                        src={tip.image_url}
                                        alt={tip.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="bg-super-securite-surface-elevated flex h-full items-center justify-center">
                                        <Shield className="text-super-securite-muted size-10" />
                                    </div>
                                )}
                                {tip.category ? (
                                    <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                        {tip.category}
                                    </span>
                                ) : null}
                            </div>

                            <div className="p-6">
                                <div className="text-super-securite-muted mb-3 flex items-center gap-3 text-sm">
                                    {tip.published_at_formatted ? (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="size-4" />
                                            {tip.published_at_formatted}
                                        </span>
                                    ) : null}
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-4" />
                                        {tip.read_time} min
                                    </span>
                                </div>

                                <h3 className="font-heading group-hover:text-super-securite-accent mb-3 line-clamp-2 text-lg font-semibold text-super-securite-heading transition-colors">
                                    {tip.title}
                                </h3>

                                {tip.excerpt ? (
                                    <p className="text-super-securite-muted mb-4 line-clamp-3 text-sm">
                                        {tip.excerpt}
                                    </p>
                                ) : null}

                                <Link
                                    href={conseilsShow.url(tip.slug)}
                                    className="text-super-securite-accent inline-flex items-center gap-1 text-sm font-semibold"
                                >
                                    Lire le conseil
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
