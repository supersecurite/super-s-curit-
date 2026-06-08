import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import ArticlesSection from '@/components/marketing/articles-section';
import CtaBand from '@/components/marketing/cta-band';
import MarketingHeroCarousel from '@/components/marketing/marketing-hero-carousel';
import SecurityTipsSection from '@/components/marketing/security-tips-section';
import ServiceCards from '@/components/marketing/service-cards';
import TestimonialsSection from '@/components/marketing/testimonials-section';
import WelcomeSection from '@/components/marketing/welcome-section';
import PartnersSection from '@/components/marketing/partners-section';
import WhyUsSection from '@/components/marketing/why-us-section';
import type { MarketingContentPreview } from '@/types/marketing-content';

type HomePageProps = {
    featuredArticles: MarketingContentPreview[];
    featuredSecurityTips: MarketingContentPreview[];
};

export default function MarketingHome() {
    const { featuredArticles = [], featuredSecurityTips = [] } =
        usePage<HomePageProps>().props;

    return (
        <>
            <SeoHead />

            <MarketingHeroCarousel />

            <div className="marketing-section-white">
                <WelcomeSection />
            </div>

            <div className="marketing-section-band">
                <ServiceCards />
            </div>

            <div className="marketing-section-white">
                <ArticlesSection articles={featuredArticles} />
            </div>

            <div className="marketing-section-band">
                <SecurityTipsSection tips={featuredSecurityTips} />
            </div>

            <div className="marketing-section-white">
                <WhyUsSection />
            </div>

            <div className="marketing-section-band">
                <PartnersSection />
            </div>

            <div className="marketing-section-white">
                <TestimonialsSection />
            </div>

            <div className="marketing-section-band">
                <CtaBand />
            </div>
        </>
    );
}
