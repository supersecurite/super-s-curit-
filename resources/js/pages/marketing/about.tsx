import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import MissionSection from '@/components/marketing/mission-section';
import PageHero from '@/components/marketing/page-hero';
import ValuesSection from '@/components/marketing/values-section';
import WhyUsSection from '@/components/marketing/why-us-section';
import { superSecuriteImages } from '@/data/super-securite-images';

export default function MarketingAbout() {
    return (
        <>
            <SeoHead />

            <PageHero
                label="Pourquoi nous"
                title={
                    <>
                        Choisir Super{' '}
                        <span className="marketing-text-gradient">
                            SÉCURITÉ
                        </span>
                    </>
                }
                description="Expérience, réactivité, disponibilité 24/7 et équipe certifiée : Super Sécurité accompagne entreprises et particuliers pour une protection fiable à Conakry et en Guinée."
                media={
                    <div className="relative mx-auto w-full max-w-lg">
                        <div className="relative overflow-hidden rounded-3xl border border-super-securite-border bg-super-securite-surface p-8 shadow-xl shadow-slate-900/10">
                            <img
                                src={superSecuriteImages.brand}
                                alt="Super Sécurité — sécurité privée"
                                width={400}
                                height={400}
                                className="mx-auto h-auto w-2/3 object-contain"
                                fetchPriority="high"
                            />
                        </div>
                    </div>
                }
            />

            <MissionSection />
            <WhyUsSection />
            <ValuesSection />
            <CtaBand />
        </>
    );
}
