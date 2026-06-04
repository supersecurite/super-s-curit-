import { lazy, Suspense } from 'react';
import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import LatestProjects from '@/components/marketing/latest-projects';
import MarketingHero from '@/components/marketing/marketing-hero';
import ServiceCards from '@/components/marketing/service-cards';

const TechMarquee = lazy(
    () => import('@/components/marketing/tech-marquee'),
);
// import TechStack from '@/components/marketing/tech-stack';

export default function MarketingHome() {
    return (
        <>
            <SeoHead />

            <MarketingHero />
            <Suspense fallback={null}>
                <div className="marketing-below-fold">
                    <TechMarquee />
                </div>
            </Suspense>
            <div className="marketing-below-fold">
                <ServiceCards />
            </div>
            <div className="marketing-below-fold">
                <LatestProjects />
            </div>
            {/* <TechStack /> */}
            <CtaBand />
        </>
    );
}
