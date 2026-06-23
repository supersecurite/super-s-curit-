import { Link } from '@inertiajs/react';
import {
    superSecuriteServices,
    superSecuriteServicesSection,
} from '@/data/super-securite-content';
import { superSecuriteStock } from '@/data/super-securite-stock';
import Reveal from '@/components/marketing/reveal';

const serviceImages = superSecuriteStock.home.services;

export default function ServiceCards() {
    return (
        <section id="services" className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-14 max-w-2xl">
                    <p className="marketing-label mb-3">
                        {superSecuriteServicesSection.sectionLabel}
                    </p>
                    <h2 className="marketing-heading-section">
                        Nos offres de service de{' '}
                        <span className="text-black">
                            sécurité
                        </span>
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed md:text-base">
                        {superSecuriteServicesSection.intro}
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {superSecuriteServices.map((service, index) => {
                        const Icon = service.icon;
                        const image =
                            serviceImages[
                                service.id as keyof typeof serviceImages
                            ];

                        return (
                            <Reveal
                                key={service.id}
                                delay={index * 120}
                                className="h-full"
                            >
                                <Link
                                    href={service.path}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-super-securite-surface shadow-md shadow-slate-900/5 transition-shadow duration-200 hover:shadow-lg hover:shadow-slate-900/10"
                                >
                                    <article id={service.id} className="flex h-full flex-col">
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img
                                                src={image}
                                                alt={service.title}
                                                width={640}
                                                height={400}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col p-6 md:p-8">
                                            <div className="mb-1 inline-flex size-12 p-0">
                                                <Icon
                                                    className="size-6 text-super-securite-accent"
                                                    strokeWidth={1.8}
                                                    aria-hidden
                                                />
                                            </div>
                                            <h3 className="font-heading text-xl font-semibold text-super-securite-heading">
                                                {service.title}
                                            </h3>
                                            <p className="mt-3 flex-1 text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                            <span className="mt-4 text-sm font-semibold text-super-securite-accent">
                                                En savoir plus →
                                            </span>
                                        </div>
                                    </article>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
