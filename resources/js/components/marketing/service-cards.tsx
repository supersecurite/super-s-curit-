import { superSecuriteServices } from '@/data/super-securite-content';
import { superSecuriteStock } from '@/data/super-securite-stock';
import Reveal from '@/components/marketing/reveal';

const serviceImages = superSecuriteStock.home.services;

export default function ServiceCards() {
    return (
        <section id="services" className="py-10 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-14 max-w-2xl">
                    <p className="marketing-label mb-3">Services</p>
                    <h2 className="marketing-heading-section">
                        Nos offres de service de{' '}
                        <span className="marketing-text-gradient">
                            sécurité
                        </span>
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                                <article
                                    id={service.id}
                                    className="group marketing-card-interactive flex h-full flex-col overflow-hidden p-0"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden border-b border-super-securite-border">
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
                                        <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl border border-super-securite-accent/20 bg-super-securite-accent/10">
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
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
