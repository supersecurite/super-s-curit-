import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { superSecuriteWelcome } from '@/data/super-securite-content';
import { superSecuriteStock } from '@/data/super-securite-stock';
import Reveal from '@/components/marketing/reveal';
import { about } from '@/routes';

export default function WelcomeSection() {
    return (
        <section id="bienvenue" className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <Reveal delay={200} variant="fade" className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-3xl">
                            <img
                                src={superSecuriteStock.home.welcome2}
                                alt="Équipe Super Sécurité — sécurité privée en Guinée"
                                width={900}
                                height={600}
                                loading="lazy"
                                decoding="async"
                                className="aspect-[4/3] h-auto w-full object-cover"
                            />
                        </div>
                    </Reveal>
                    <Reveal className="order-1 lg:order-2">
                        <p className="marketing-label mb-3">Super SÉCURITÉ</p>
                        <h2 className="marketing-heading-section">
                            {superSecuriteWelcome.title}
                        </h2>
                        {superSecuriteWelcome.paragraphs.map((paragraph) => (
                            <p
                                key={paragraph.slice(0, 40)}
                                className="mt-4 text-sm leading-relaxed md:text-base"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
