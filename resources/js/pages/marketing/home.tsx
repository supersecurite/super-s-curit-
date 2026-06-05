import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import MarketingHero from '@/components/marketing/marketing-hero';
import SecurityTipsSection from '@/components/marketing/security-tips-section';
import ServiceCards from '@/components/marketing/service-cards';
import TestimonialsSection from '@/components/marketing/testimonials-section';
import WelcomeSection from '@/components/marketing/welcome-section';
import PartnersSection from '@/components/marketing/partners-section';
import WhyUsSection from '@/components/marketing/why-us-section';

type FeaturedSecurityTip = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    category: string | null;
    read_time: number;
    published_at_formatted: string | null;
};

type HomePageProps = {
    featuredSecurityTips: FeaturedSecurityTip[];
};

export default function MarketingHome() {
    const { featuredSecurityTips = [] } = usePage<HomePageProps>().props;

    return (
        <>
            <SeoHead />

            <MarketingHero />

            <div className="marketing-section-band-alt">
                <WelcomeSection />
            </div>

            <div className="marketing-section-band">
                <ServiceCards />
            </div>

            <div className="marketing-section-band-alt">
                <SecurityTipsSection tips={featuredSecurityTips} />
            </div>

            <div className="marketing-section-band">
                <WhyUsSection />
            </div>

            <div className="marketing-section-band">
                <PartnersSection />
            </div>

            <div className="marketing-section-band-alt">
                <TestimonialsSection />
            </div>

            <div className="marketing-section-band">
                <CtaBand />
            </div>
        </>
    );
}
