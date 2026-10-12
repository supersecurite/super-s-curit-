import SeoHead from '@/components/marketing/seo-head';
import MarketingFullscreenHero from '@/components/marketing/marketing-fullscreen-hero';
import SecurityAgentRegistrationForm from '@/components/marketing/security-agent-registration-form';
import { useMarketingPageHero } from '@/hooks/use-marketing-page-hero';

export default function MarketingDevenirAgent() {
    const hero = useMarketingPageHero('devenirAgent');

    return (
        <>
            <SeoHead />

            <MarketingFullscreenHero {...hero} />

            <section className="marketing-section-white marketing-below-fold py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <SecurityAgentRegistrationForm />
                </div>
            </section>
        </>
    );
}
