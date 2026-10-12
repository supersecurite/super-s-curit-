import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import MarketingFullscreenHero from '@/components/marketing/marketing-fullscreen-hero';
import ValuesSection from '@/components/marketing/values-section';
import WhyUsPageSection from '@/components/marketing/why-us-page-section';
import { useMarketingPageHero } from '@/hooks/use-marketing-page-hero';
import type { GalleryVideoPublic } from '@/types/gallery';

type PageProps = {
    featuredVideo: GalleryVideoPublic | null;
};

export default function MarketingAbout() {
    const { featuredVideo } = usePage<PageProps>().props;
    const hero = useMarketingPageHero('about');

    return (
        <>
            <SeoHead />

            <MarketingFullscreenHero {...hero} />


            <WhyUsPageSection featuredVideo={featuredVideo} />
            <ValuesSection />
            <CtaBand />
        </>
    );
}
