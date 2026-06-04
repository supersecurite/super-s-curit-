import { Quote } from 'lucide-react';
import { superSecuriteTestimonials } from '@/data/super-securite-content';
import { superSecuriteStock } from '@/data/super-securite-stock';
import Reveal from '@/components/marketing/reveal';

export default function TestimonialsSection() {
    return (
        <section id="temoignages" className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-14 max-w-2xl">
                    <p className="marketing-label mb-3">Témoignages</p>
                    <h2 className="marketing-heading-section">
                        De nos{' '}
                        <span className="marketing-text-gradient">clients</span>
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {superSecuriteTestimonials.map((item, index) => (
                        <Reveal key={item.author} delay={index * 120}>
                            <blockquote className="marketing-card-interactive flex h-full flex-col p-6 md:p-8">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={
                                            superSecuriteStock.home
                                                .testimonialAvatar
                                        }
                                        alt=""
                                        width={56}
                                        height={56}
                                        loading="lazy"
                                        decoding="async"
                                        className="size-14 shrink-0 rounded-full border border-super-securite-border object-cover"
                                        aria-hidden
                                    />
                                    <Quote
                                        className="size-8 text-super-securite-accent/40"
                                        aria-hidden
                                    />
                                </div>
                                <p className="mt-4 flex-1 text-sm leading-relaxed italic">
                                    {item.quote}
                                </p>
                                <footer className="mt-6 border-t border-super-securite-border pt-4 text-sm font-medium text-super-securite-heading">
                                    {item.author}
                                </footer>
                            </blockquote>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
