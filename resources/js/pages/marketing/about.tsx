import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import MarketingFullscreenHero from '@/components/marketing/marketing-fullscreen-hero';
import ValuesSection from '@/components/marketing/values-section';
import WhyUsPageSection from '@/components/marketing/why-us-page-section';
import { marketingPageHeroes } from '@/data/marketing-page-heroes';

export default function MarketingAbout() {
    return (
        <>
            <SeoHead />

            <MarketingFullscreenHero {...marketingPageHeroes.about} />

            <WhyUsPageSection />
            <ValuesSection />
            <CtaBand />
        </>
    );
}
