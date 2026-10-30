import { usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Clock,
    FileText,
    Handshake,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from 'lucide-react';
import ContactForm from '@/components/marketing/contact-form';
import SeoHead from '@/components/marketing/seo-head';
import { useTrans } from '@/hooks/use-trans';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type FaqGroup = {
    title: string;
    faqs: Array<{ question: string; answer: string }>;
};

type Step = { title: string; description: string };

type SharedPageProps = {
    superSecurite: SuperSecuriteConfig;
};

function phoneHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export default function MarketingContact() {
    const { superSecurite } = usePage<SharedPageProps>().props;
    const { t, tNode } = useTrans();
    const steps = tNode<Step[]>('contact_v2.steps', []);
    const faqGroups = tNode<FaqGroup[]>('contact.faq_groups', []);
    const phoneDigits = superSecurite.phone.replace(/[^0-9]/g, '');
    const stepIcons = [MessageCircle, FileText, Handshake];

    return (
        <div className="contact-v2">
            <SeoHead />
            <section className="contact-v2-hero">
                <img
                    src="/images/super-securite/contact-v2-hero.jpg"
                    alt=""
                    width={1980}
                    height={794}
                    fetchPriority="high"
                />
                <div className="contact-v2-container">
                    <p className="contact-v2-eyebrow">
                        {t('contact_v2.label')}
                    </p>
                    <h1>
                        {t('contact_v2.title_lead')}
                        <strong>{t('contact_v2.title_accent')}</strong>
                    </h1>
                    <p>{t('contact_v2.description')}</p>
                </div>
            </section>

            <section className="contact-v2-main">
                <div className="contact-v2-container contact-v2-main-grid">
                    <aside className="contact-v2-coordinates">
                        <h2>{t('contact_v2.coordinates_title')}</h2>
                        <ul>
                            <li>
                                <MapPin aria-hidden="true" />
                                <span>{superSecurite.address}</span>
                            </li>
                            <li>
                                <Phone aria-hidden="true" />
                                <a href={superSecurite.phone_href}>
                                    {superSecurite.phone}
                                </a>
                            </li>
                            {superSecurite.phone_secondary ? (
                                <li>
                                    <Phone aria-hidden="true" />
                                    <a
                                        href={phoneHref(
                                            superSecurite.phone_secondary,
                                        )}
                                    >
                                        {superSecurite.phone_secondary}
                                    </a>
                                </li>
                            ) : null}
                            <li>
                                <Mail aria-hidden="true" />
                                <a href={`mailto:${superSecurite.email}`}>
                                    {superSecurite.email}
                                </a>
                            </li>
                            <li>
                                <Clock aria-hidden="true" />
                                <span>{t('contact_v2.hours')}</span>
                            </li>
                        </ul>
                        {superSecurite.rccm ? (
                            <p className="contact-v2-rccm">
                                RCCM : {superSecurite.rccm}
                            </p>
                        ) : null}
                        <a
                            className="contact-v2-whatsapp"
                            href={`https://wa.me/${phoneDigits}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle aria-hidden="true" />
                            {t('contact_v2.whatsapp')}
                        </a>
                    </aside>
                    <div className="contact-v2-form" id="devis">
                        <ContactForm />
                    </div>
                </div>
            </section>

            <section
                id="plan-acces"
                className="contact-v2-access"
                aria-labelledby="contact-map-heading"
            >
                <div className="contact-v2-container contact-v2-access-grid">
                    <iframe
                        title={`${t('contact.map_iframe_title')}, ${superSecurite.address}`}
                        src={superSecurite.map.embedUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                    <div>
                        <h2 id="contact-map-heading">
                            {t('contact_v2.join_title')}
                        </h2>
                        <p>
                            {t('contact_v2.join_text', {
                                address: superSecurite.address,
                            })}
                        </p>
                        <p className="contact-v2-pin">
                            <MapPin aria-hidden="true" />
                            <span>{superSecurite.address}</span>
                        </p>
                        <a
                            href={superSecurite.map.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('contact.map_open_maps')}
                        </a>
                    </div>
                </div>
            </section>

            <section className="contact-v2-process contact-v2-container">
                <h2>{t('contact_v2.process_title')}</h2>
                <ol>
                    {steps.map((step, index) => {
                        const Icon = stepIcons[index % stepIcons.length];

                        return (
                            <li key={step.title}>
                                <span>
                                    {index + 1}
                                    <Icon aria-hidden="true" />
                                </span>
                                <div>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </section>

            <section id="faq" className="contact-v2-faq contact-v2-container">
                <h2>{t('contact.faq_title')}</h2>
                {faqGroups.map((group) => (
                    <div key={group.title}>
                        <h3>{group.title}</h3>
                        <div className="contact-v2-faq-grid">
                            {group.faqs.map((faq) => (
                                <details key={faq.question}>
                                    <summary>
                                        {faq.question}
                                        <ChevronDown
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </summary>
                                    <p>{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
