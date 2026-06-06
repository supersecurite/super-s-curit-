import { superSecuriteAdvantages } from '@/data/super-securite-content';
import { superSecuriteStock } from '@/data/super-securite-stock';
import Reveal from '@/components/marketing/reveal';

export default function WhyUsSection() {
    return (
        <section id="pourquoi" className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-10 max-w-2xl text-center">
                    <p className="marketing-label mb-3">Pourquoi</p>
                    <h2 className="marketing-heading-section">
                        Choisir Super{' '}
                        <span className="marketing-text-gradient">SÉCURITÉ</span>{' '}
                        ?
                    </h2>
                </Reveal>

                <Reveal delay={100} className="mb-14">
                    <div className="overflow-hidden rounded-3xl border-none shadow-none">
                        <img
                            src={superSecuriteStock.home.whyUsBannerTransparent}
                            alt="Super Sécurité — équipes et sites sécurisés"
                            width={1600}
                            height={500}
                            loading="lazy"
                            decoding="async"
                            className="aspect-[21/11] w-full object-cover object-top"
                        />
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {superSecuriteAdvantages.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Reveal key={item.title} delay={index * 100}>
                                <article className="marketing-card-interactive flex h-full flex-col p-6 text-center md:p-8">
                                    <div className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full border border-super-securite-accent/20 bg-super-securite-accent/10">
                                        <Icon
                                            className="size-6 text-super-securite-accent"
                                            strokeWidth={1.8}
                                            aria-hidden
                                        />
                                    </div>
                                    <h3 className="font-heading text-lg font-semibold text-super-securite-heading">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
