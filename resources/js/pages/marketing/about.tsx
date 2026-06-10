import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import MissionSection from '@/components/marketing/mission-section';
import MarketingFullscreenHero from '@/components/marketing/marketing-fullscreen-hero';
import ValuesSection from '@/components/marketing/values-section';
import WhyUsSection from '@/components/marketing/why-us-section';
import { marketingPageHeroes } from '@/data/marketing-page-heroes';

export default function MarketingAbout() {
    return (
        <>
            <SeoHead />

            <MarketingFullscreenHero {...marketingPageHeroes.about} />

            <MissionSection />
            <WhyUsSection showCinematicHero={false} />
            <ValuesSection />
            <CtaBand />
        </>
    );
}
