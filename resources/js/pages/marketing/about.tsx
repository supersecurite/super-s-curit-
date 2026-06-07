import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import MissionSection from '@/components/marketing/mission-section';
import MarketingSplitHero from '@/components/marketing/marketing-split-hero';
import ValuesSection from '@/components/marketing/values-section';
import WhyUsSection from '@/components/marketing/why-us-section';
import { marketingPageHeroes } from '@/data/marketing-page-heroes';

export default function MarketingAbout() {
    return (
        <>
            <SeoHead />

            <MarketingSplitHero {...marketingPageHeroes.about} />

            <MissionSection />
            <WhyUsSection />
            <ValuesSection />
            <CtaBand />
        </>
    );
}
