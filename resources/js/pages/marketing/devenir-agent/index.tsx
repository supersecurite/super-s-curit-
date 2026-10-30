import {
    ChevronDown,
    GraduationCap,
    Handshake,
    ShieldCheck,
    Users,
} from 'lucide-react';
import RecruitmentV2Hero from '@/components/marketing/recruitment-v2-hero';
import RecruitmentV2Steps from '@/components/marketing/recruitment-v2-steps';
import SecurityAgentRegistrationForm from '@/components/marketing/security-agent-registration-form';
import SeoHead from '@/components/marketing/seo-head';
import { useTrans } from '@/hooks/use-trans';

type Benefit = { title: string; description: string };
type Faq = { question: string; answer: string };

export default function MarketingDevenirAgent() {
    const { t, tNode } = useTrans();
    const benefits = tNode<Benefit[]>('recruitment_v2.benefits', []);
    const faqs = tNode<Faq[]>('recruitment_v2.faqs', []);
    const icons = [GraduationCap, Users, Handshake, ShieldCheck];

    return (
        <div className="recruitment-v2">
            <SeoHead />
            <RecruitmentV2Hero />
            <section className="recruitment-v2-benefits recruitment-v2-container">
                {benefits.map((benefit, index) => {
                    const Icon = icons[index % icons.length];

                    return (
                        <div key={benefit.title}>
                            <Icon
                                size={34}
                                strokeWidth={1.6}
                                aria-hidden="true"
                            />
                            <h2>{benefit.title}</h2>
                            <p>{benefit.description}</p>
                        </div>
                    );
                })}
            </section>
            <section className="recruitment-v2-application">
                <div className="recruitment-v2-container recruitment-v2-application-grid">
                    <aside className="recruitment-v2-process">
                        <img
                            src="/images/super-securite/about-v2-team.jpg"
                            alt={t('recruitment_v2.team_alt')}
                            width={1980}
                            height={794}
                            loading="lazy"
                        />
                        <div>
                            <h2>{t('recruitment_v2.process_title')}</h2>
                            <p>{t('recruitment_v2.process_description')}</p>
                            <RecruitmentV2Steps />
                        </div>
                    </aside>
                    <div id="candidature" className="recruitment-v2-form">
                        <SecurityAgentRegistrationForm />
                    </div>
                </div>
            </section>
            <section className="recruitment-v2-faq recruitment-v2-container">
                <h2 className="resource-v2-section-title">
                    {t('recruitment_v2.faq_title')}
                </h2>
                {faqs.map((faq) => (
                    <details key={faq.question}>
                        <summary>
                            {faq.question}
                            <ChevronDown size={18} aria-hidden="true" />
                        </summary>
                        <p>{faq.answer}</p>
                    </details>
                ))}
            </section>
        </div>
    );
}
