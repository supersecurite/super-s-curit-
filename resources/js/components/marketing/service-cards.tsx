import { ArrowUpRight } from 'lucide-react';
import { aristechServices } from '@/data/aristech-content';
import Reveal from '@/components/marketing/reveal';

export default function ServiceCards() {
    return (
        <section className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-14 max-w-2xl">
                    <p className="marketing-label mb-3">Services</p>
                    <h2 className="marketing-heading-section">
                        Ce que nous construisons{' '}
                        <span className="marketing-text-gradient">pour vous</span>
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {aristechServices.map((service, index) => (
                        <Reveal
                            key={service.title}
                            delay={index * 120}
                            className="h-full"
                        >
                            <article className="marketing-card-interactive group relative flex h-full flex-col overflow-hidden !p-0">
                                <div className="relative aspect-[16/9] overflow-hidden bg-aristech-surface-elevated">
                                    <img
                                        src={service.cover}
                                        alt=""
                                        loading="lazy"
                                        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                        aria-hidden
                                    />
                                    <div
                                        className="absolute inset-0 bg-linear-to-t from-aristech-heading/30 via-transparent to-transparent"
                                        aria-hidden
                                    />
                                    <span className="absolute right-4 bottom-4 rounded-full border border-white/30 bg-white/85 px-3 py-1 font-heading text-xs font-bold text-aristech-accent shadow-sm backdrop-blur-md">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col p-6 md:p-7">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-heading text-xl font-semibold text-aristech-heading">
                                            {service.title}
                                        </h3>
                                        <ArrowUpRight
                                            className="mt-1 size-5 shrink-0 text-aristech-muted opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-aristech-accent group-hover:opacity-100 motion-reduce:transition-none"
                                            aria-hidden
                                        />
                                    </div>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
