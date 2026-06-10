import MarketingFullscreenHero from '@/components/marketing/marketing-fullscreen-hero';
import ServicePageSections from '@/components/marketing/service-layouts/service-page-sections';
import type { ServicePageLayoutProps } from '@/components/marketing/service-layouts/types';

export default function ServicePageLayout({
    content,
    faqs,
}: ServicePageLayoutProps) {
    return (
        <>
            <MarketingFullscreenHero {...content.hero} />
            <ServicePageSections content={content} faqs={faqs} />
        </>
    );
}
