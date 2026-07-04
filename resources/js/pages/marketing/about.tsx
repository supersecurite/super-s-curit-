import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import MarketingFullscreenHero from '@/components/marketing/marketing-fullscreen-hero';
import MarketingYoutubeEmbed from '@/components/marketing/marketing-youtube-embed';
import ValuesSection from '@/components/marketing/values-section';
import WhyUsPageSection from '@/components/marketing/why-us-page-section';
import { marketingPageHeroes } from '@/data/marketing-page-heroes';
import type { GalleryVideoPublic } from '@/types/gallery';

type PageProps = {
    featuredVideo: GalleryVideoPublic | null;
};

export default function MarketingAbout() {
    const { featuredVideo } = usePage<PageProps>().props;

    return (
        <>
            <SeoHead />

            <MarketingFullscreenHero {...marketingPageHeroes.about} />

            {featuredVideo ? (
                <section className="marketing-section-band marketing-below-fold py-14 md:py-20">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <MarketingYoutubeEmbed
                            video={featuredVideo}
                            title="Super Sécurité en action"
                            description="Découvrez notre équipe et notre engagement sur le terrain à Conakry et en région."
                        />
                    </div>
                </section>
            ) : null}

            <WhyUsPageSection />
            <ValuesSection />
            <CtaBand />
        </>
    );
}
