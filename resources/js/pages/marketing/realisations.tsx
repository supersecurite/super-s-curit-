import { Link, usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import PageHero from '@/components/marketing/page-hero';
import Reveal from '@/components/marketing/reveal';

type CaseStudyCard = {
    slug: string;
    title: string;
    category: string;
    summary: string;
    image: string;
    path: string;
};

type PageProps = {
    caseStudies: CaseStudyCard[];
};

export default function RealisationsPage() {
    const { caseStudies } = usePage<PageProps>().props;

    return (
        <>
            <SeoHead />

            <PageHero
                label="Portfolio"
                title={
                    <>
                        Nos{' '}
                        <span className="marketing-text-gradient">réalisations</span>
                    </>
                }
                description="Plateformes web, e-commerce et applications livrées pour des clients en Guinée et à l'international."
            />

            <section className="py-10">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
                    {caseStudies.map((study, index) => (
                        <Reveal key={study.slug} delay={index * 100}>
                            <article className="marketing-card flex h-full flex-col overflow-hidden p-0">
                                <img
                                    src={study.image}
                                    alt={study.title}
                                    width={640}
                                    height={480}
                                    className="aspect-[4/3] w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="flex flex-1 flex-col p-6">
                                    <p className="marketing-label mb-2">{study.category}</p>
                                    <h2 className="font-heading text-xl font-semibold text-super-securite-heading">
                                        <Link
                                            href={study.path}
                                            className="cursor-pointer hover:text-super-securite-accent"
                                        >
                                            {study.title}
                                        </Link>
                                    </h2>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed text-super-securite-muted">
                                        {study.summary}
                                    </p>
                                    <Link
                                        href={study.path}
                                        className="mt-4 text-sm font-semibold text-super-securite-accent"
                                    >
                                        Voir l&apos;étude de cas →
                                    </Link>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>
        </>
    );
}
