import { Head } from '@inertiajs/react';
import CtaBand from '@/components/marketing/cta-band';
import FounderSection from '@/components/marketing/founder-section';
import PageHero from '@/components/marketing/page-hero';
import ProcessTimeline from '@/components/marketing/process-timeline';
import StatGrid from '@/components/marketing/stat-grid';
import StorySection from '@/components/marketing/story-section';
import ValuesSection from '@/components/marketing/values-section';
import { aristechImages } from '@/data/aristech-images';
import { aristechStock } from '@/data/aristech-stock';

export default function MarketingAbout() {
    return (
        <>
            <Head>
                <title>À propos — ArisTech</title>
                <meta
                    name="description"
                    content="ArisTech est un studio de développement web et mobile basé en Guinée. Découvrez notre histoire, nos valeurs et notre méthode de travail."
                />
                <meta property="og:title" content="À propos — ArisTech" />
                <meta
                    property="og:description"
                    content="Studio de développement web et mobile. Sur mesure, transparent, agile."
                />
                <meta property="og:image" content={aristechImages.ogDefault} />
            </Head>

            <PageHero
                label="À propos"
                title={
                    <>
                        Un studio à taille humaine,{' '}
                        <span className="marketing-text-gradient">
                            une exigence d&apos;agence
                        </span>
                    </>
                }
                description="ArisTech conçoit, développe et déploie des produits numériques sur mesure pour des entreprises ambitieuses. Plus qu'un prestataire : un partenaire technique de confiance."
                media={
                    <div className="relative mx-auto w-full max-w-lg">
                        <div
                            className="absolute -inset-4 rounded-3xl border border-dashed border-aristech-border/60"
                            aria-hidden
                        />
                        <div className="relative overflow-hidden rounded-3xl border border-aristech-border bg-aristech-surface shadow-xl shadow-slate-900/10">
                            <img
                                src={aristechStock.about.heroSide}
                                alt="Équipe ArisTech en collaboration sur un projet"
                                width={1200}
                                height={900}
                                className="aspect-[4/4] h-auto w-full object-cover"
                                fetchPriority="high"
                            />
                            <div
                                className="pointer-events-none absolute inset-0 bg-linear-to-t from-aristech-heading/30 via-transparent to-transparent"
                                aria-hidden
                            />
                        </div>
                    </div>
                }
            >
                <StatGrid />
            </PageHero>

            <StorySection />
            <ValuesSection />
            {/* <ProcessTimeline /> */}
            <FounderSection />
            <CtaBand />
        </>
    );
}
