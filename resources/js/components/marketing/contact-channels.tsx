import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteHoursLong } from '@/data/super-securite-hours';
import type { SuperSecuriteConfig } from '@/types/super-securite';

type ContactChannelsProps = {
    superSecurite: SuperSecuriteConfig;
};

export default function ContactChannels({ superSecurite }: ContactChannelsProps) {
    const phoneDigits = superSecurite.phone_href.replace(/[^0-9]/g, '');

    const channels = [
        {
            icon: Mail,
            label: 'Email',
            value: superSecurite.email,
            description: 'Réponse rapide à votre demande',
            href: `mailto:${superSecurite.email}`,
            cta: 'Écrire un email',
        },
        {
            icon: Phone,
            label: 'Téléphone',
            value: superSecurite.phone,
            description: `Disponible ${superSecuriteHoursLong}`,
            href: superSecurite.phone_href,
            cta: 'Appeler',
        },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: superSecurite.phone,
            description: 'Discussion rapide et fichiers',
            href: `https://wa.me/${phoneDigits}`,
            cta: 'Ouvrir WhatsApp',
        },
    ] as const;

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {channels.map((channel, index) => {
                const Icon = channel.icon;
                const isExternal = channel.href.startsWith('http');

                return (
                    <Reveal
                        key={channel.label}
                        delay={index * 100}
                        className="h-full"
                    >
                        <a
                            href={channel.href}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className="marketing-card-interactive group relative flex h-full flex-col overflow-hidden"
                        >
                            <div
                                className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-super-securite-accent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
                                aria-hidden
                            />

                            <div className="flex items-start justify-between">
                                <div className="flex flex-row items-center justify-items-center gap-2">
                                    <div className="inline-flex size-12 items-center justify-center rounded-xl bg-super-securite-accent/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
                                        <Icon
                                            className="size-6 text-super-securite-accent"
                                            strokeWidth={2}
                                            aria-hidden
                                        />
                                    </div>

                                    <h3 className="mt-6 font-heading text-lg font-semibold text-super-securite-heading">
                                        {channel.label}
                                    </h3>
                                </div>
                                <ArrowUpRight
                                    className="size-5 text-super-securite-muted opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-super-securite-accent group-hover:opacity-100 motion-reduce:transition-none"
                                    aria-hidden
                                />
                            </div>
                            <p className="mt-1 font-heading text-sm font-medium text-super-securite-accent">
                                {channel.value}
                            </p>
                            <p className="mt-3 flex-1 text-sm leading-relaxed text-super-securite-muted">
                                {channel.description}
                            </p>

                            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-super-securite-heading uppercase">
                                {channel.cta}
                                <ArrowUpRight
                                    className="size-3.5"
                                    aria-hidden
                                />
                            </span>
                        </a>
                    </Reveal>
                );
            })}
        </div>
    );
}
