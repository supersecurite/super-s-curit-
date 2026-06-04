import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import ServiceFaq from '@/components/marketing/service-faq';
import CtaBand from '@/components/marketing/cta-band';
import PageHero from '@/components/marketing/page-hero';
import Reveal from '@/components/marketing/reveal';
import type { ServicePageContent } from '@/data/super-securite-service-pages';

type PageProps = {
    pageFaqs: { question: string; answer: string }[];
};

export default function ServicePage({
    content,
}: {
    content: ServicePageContent;
}) {
    const { pageFaqs } = usePage<PageProps>().props;

    return (
        <>
            <SeoHead />

            <PageHero
                label={content.label}
                title={
                    <>
                        {content.title}{' '}
                        <span className="marketing-text-gradient">
                            {content.highlightedTitle}
                        </span>
                    </>
                }
                description={content.description}
                media={
                    <div className="relative mx-auto w-full max-w-lg">
                        <div
                            className="absolute -inset-4 rounded-3xl border border-dashed border-super-securite-border/60"
                            aria-hidden
                        />
                        <div className="relative overflow-hidden rounded-3xl border border-super-securite-border bg-super-securite-surface shadow-xl shadow-slate-900/10">
                            <img
                                src={content.image}
                                alt={content.imageAlt}
                                width={1200}
                                height={900}
                                className="aspect-[4/3] h-auto w-full object-cover"
                                fetchPriority="high"
                            />
                            <div
                                className="pointer-events-none absolute inset-0 bg-linear-to-t from-super-securite-heading/40 via-transparent to-transparent"
                                aria-hidden
                            />
                        </div>
                    </div>
                }
            >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {content.benefits.map((benefit) => (
                        <div
                            key={benefit}
                            className="rounded-2xl border border-super-securite-border bg-white/60 p-4 text-sm font-semibold text-super-securite-heading shadow-sm"
                        >
                            {benefit}
                        </div>
                    ))}
                </div>
            </PageHero>

            <section className="py-10">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                    {content.sections.map((section, index) => (
                        <Reveal key={section.title} delay={index * 120}>
                            <article className="marketing-card h-full">
                                <p className="marketing-label mb-3">
                                    {String(index + 1).padStart(2, '0')}
                                </p>
                                <h2 className="font-heading text-xl font-semibold text-super-securite-heading">
                                    {section.title}
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-super-securite-muted">
                                    {section.description}
                                </p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>

            <ServiceFaq faqs={pageFaqs} />

            <CtaBand />
        </>
    );
}
