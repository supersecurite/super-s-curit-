import SeoHead from '@/components/marketing/seo-head';
import MarketingSplitHero from '@/components/marketing/marketing-split-hero';
import SecurityAgentRegistrationForm from '@/components/marketing/security-agent-registration-form';
import { marketingPageHeroes } from '@/data/marketing-page-heroes';

export default function MarketingDevenirAgent() {
    return (
        <>
            <SeoHead />

            <MarketingSplitHero {...marketingPageHeroes.devenirAgent} />

            <section className="marketing-section-band marketing-below-fold py-16">
                <div className="container mx-auto max-w-3xl px-4">
                    <SecurityAgentRegistrationForm />
                </div>
            </section>
        </>
    );
}
