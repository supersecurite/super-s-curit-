import { Link } from '@inertiajs/react';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { useTrans } from '@/hooks/use-trans';

export type ResourceSection = 'news' | 'tips' | 'gallery';
const sections = [
    { id: 'news', path: '/actualites', label: 'nav.news' },
    { id: 'tips', path: '/conseils-securite', label: 'footer.tips' },
    { id: 'gallery', path: '/galerie', label: 'footer.gallery' },
] as const;

/** Entrée commune aux actualités, conseils et médias, avec URLs partageables. */
export default function ResourcesV2Header({
    active,
    compact = false,
}: {
    active: ResourceSection;
    compact?: boolean;
}) {
    const { t } = useTrans();
    const lp = useLocalizedUrl();

    return (
        <>
            {!compact && (
                <section
                    className="resources-v2-hero"
                    aria-labelledby="resources-v2-title"
                >
                    <img
                        src="/images/super-securite/resources-v2-hero.jpg"
                        alt=""
                        width={1980}
                        height={794}
                        fetchPriority="high"
                    />
                    <div className="resources-v2-container">
                        <h1 id="resources-v2-title">
                            {t('resources_v2.title_lead')}
                            <strong>{t('resources_v2.title_accent')}</strong>
                        </h1>
                        <p>{t('resources_v2.description')}</p>
                    </div>
                </section>
            )}
            <nav
                className="resources-v2-tabs resources-v2-container"
                aria-label={t('footer_v2.resources')}
            >
                {sections.map((section) => (
                    <Link
                        key={section.id}
                        href={lp(section.path)}
                        aria-current={
                            active === section.id ? 'page' : undefined
                        }
                    >
                        {t(section.label)}
                    </Link>
                ))}
            </nav>
        </>
    );
}
