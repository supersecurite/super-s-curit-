import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import SeoHead from '@/components/marketing/seo-head';
import { useTrans } from '@/hooks/use-trans';
import { localizePath } from '@/lib/locale-url';

export default function MarketingDevenirAgentMerci() {
    const { t, locale } = useTrans();

    return (
        <>
            <SeoHead />

            <section className="marketing-section-band py-20">
                <div className="container mx-auto max-w-2xl px-4 text-center">
                    <div className="marketing-card mx-auto max-w-lg p-10">
                        <CheckCircle2 className="text-super-securite-accent mx-auto size-14" />
                        <h1 className="marketing-heading-section mt-6">
                            {t('devenir_agent.thank_you.title', 'Candidature envoyée')}
                        </h1>
                        <p className="text-super-securite-muted mt-4 text-sm leading-relaxed">
                            {t(
                                'devenir_agent.thank_you.description',
                                'Merci pour votre inscription. Notre équipe RH examinera votre profil et vous contactera si une opportunité correspond à votre localisation et votre expérience.',
                            )}
                        </p>
                        <Link
                            href={localizePath('/', locale)}
                            className="marketing-cta-primary mt-8 inline-flex"
                        >
                            {t(
                                'devenir_agent.thank_you.home_button',
                                "Retour à l'accueil",
                            )}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
