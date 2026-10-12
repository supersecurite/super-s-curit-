import { Link } from '@inertiajs/react';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteStock } from '@/data/super-securite-stock';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';

export default function WelcomeSection() {
    const { t, tList } = useTrans();
    const localized = useLocalizedUrl();
    const paragraphs = tList('home.welcome_paragraphs', [
        t('home.welcome_p1'),
        t('home.welcome_p2'),
        t('home.welcome_p3'),
    ]);

    return (
        <section id="bienvenue" className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <Reveal delay={200} variant="fade" className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-3xl">
                            <img
                                src={superSecuriteStock.home.welcome2}
                                alt="Équipe Super Sécurité — sécurité privée en Guinée"
                                width={900}
                                height={600}
                                loading="lazy"
                                decoding="async"
                                className="aspect-[4/3] h-auto w-full object-cover"
                            />
                        </div>
                    </Reveal>
                    <Reveal className="order-1 lg:order-2">
                        <p className="marketing-label mb-3">
                            {t('home.welcome_label', 'Super SÉCURITÉ')}
                        </p>
                        <h2 className="marketing-heading-section">
                            {t('home.welcome_title')}
                        </h2>
                        {paragraphs.map((paragraph) => (
                            <p
                                key={paragraph.slice(0, 40)}
                                className="mt-4 text-sm leading-relaxed md:text-base"
                            >
                                {paragraph}
                            </p>
                        ))}
                        <Link
                            href={localized('/a-propos')}
                            className="marketing-cta-secondary marketing-magnetic mt-6 inline-flex"
                        >
                            {t('common.learn_more', 'En savoir plus')}
                        </Link>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
