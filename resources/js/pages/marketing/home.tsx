import SeoHead from '@/components/marketing/seo-head';
import CtaBand from '@/components/marketing/cta-band';
import MarketingHero from '@/components/marketing/marketing-hero';
import ServiceCards from '@/components/marketing/service-cards';
import TestimonialsSection from '@/components/marketing/testimonials-section';
import WelcomeSection from '@/components/marketing/welcome-section';
import PartnersSection from '@/components/marketing/partners-section';
import WhyUsSection from '@/components/marketing/why-us-section';

export default function MarketingHome() {
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
