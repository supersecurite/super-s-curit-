import HeroTitleUnderline from '@/components/marketing/hero-title-underline';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteValues } from '@/data/super-securite-about';
import { superSecuriteStock } from '@/data/super-securite-stock';
import { useTrans } from '@/hooks/use-trans';

type ValueItem = { title?: string; description?: string };

export default function ValuesSection() {
    const { t, tNode } = useTrans();
    const items = tNode<ValueItem[]>('about_values.items', []);

    const values = superSecuriteValues.map((value, index) => ({
        ...value,
        title: items[index]?.title ?? value.title,
        description: items[index]?.description ?? value.description,
    }));

    const label = t('about_values.label', 'Nos valeurs');
    const titleLead = t('about_values.title_lead', 'Ce qui nous');
    const titleHighlight = t(
        'about_values.title_highlight',
        'guide au quotidien',
    );
    const description = t(
        'about_values.description',
        'Quatre principes simples qui structurent chaque décision, de la première discussion à la mise en production sur le terrain.',
    );
    const imageAlt = t(
        'about_values.image_alt',
        'Équipe Super Sécurité — nos valeurs sur le terrain',
    );

    return (
        <section className="marketing-section-band border-t border-super-securite-border py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-14 grid items-center gap-10 lg:mb-16 lg:grid-cols-12 lg:gap-14">
                    <div className="hidden lg:block lg:col-span-6 xl:col-span-7">
                        <p className="marketing-label mb-3 flex items-center gap-2 before:block before:h-px before:w-6 before:bg-super-securite-accent sm:mb-4">
                            {label}
                        </p>
                        <h2 className="font-heading text-3xl leading-[1.08] font-bold tracking-tight text-super-securite-heading sm:text-4xl md:text-[2.75rem]">
                            {titleLead}{' '}
                            <span className="relative inline-block text-super-securite-accent">
                                {titleHighlight}
                                <HeroTitleUnderline
                                    variant="draw"
                                    gradientId="values-section-underline"
                                    tone="light"
                                />
                            </span>
                        </h2>
                        <p className="mt-5 max-w-lg text-sm leading-relaxed text-super-securite-muted sm:text-base md:text-lg">
                            {description}
                        </p>
                    </div>

                    <Reveal
                        delay={120}
                        variant="fade"
                        className="lg:col-span-6 xl:col-span-5"
                    >
                        <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:max-w-none">
                            <div
                                className="pointer-events-none absolute -inset-3"
                                aria-hidden
                            />
                            <div className="relative overflow-hidden rounded-2xl">
                                <div className="relative aspect-[4/5] sm:aspect-square">
                                    <img
                                        src={superSecuriteStock.about.valuesBanner}
                                        alt={imageAlt}
                                        width={800}
                                        height={800}
                                        loading="lazy"
                                        decoding="async"
                                        className="size-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-start bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent p-6 text-white lg:hidden">
                                        <p className="mb-2 text-xs font-bold tracking-wider text-super-securite-accent uppercase">
                                            {label}
                                        </p>
                                        <h2 className="font-heading text-2xl leading-tight font-bold tracking-tight text-white">
                                            {titleLead} {titleHighlight}
                                        </h2>
                                        <p className="mt-2 text-xs leading-relaxed text-slate-300">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </Reveal>

                <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-super-securite-border bg-white shadow-sm shadow-slate-900/5 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((value, index) => (
                        <Reveal
                            key={value.title}
                            delay={index * 100}
                            className="h-full"
                        >
                            <article className="group relative flex h-full flex-col border-b border-super-securite-border p-7 transition-colors duration-300 hover:bg-super-securite-surface/60 sm:border-r sm:border-b-0 sm:last:border-r-0 md:p-8">
                                <span className="absolute top-0 left-0 h-1 w-0 bg-super-securite-accent transition-all duration-300 group-hover:w-full" />

                                <span className="mb-5 font-mono text-3xl font-bold leading-none tracking-tight text-super-securite-accent/40 transition-colors duration-300 group-hover:text-super-securite-accent md:text-4xl">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <h3 className="mb-3 font-heading text-lg font-semibold text-super-securite-heading">
                                    {value.title}
                                </h3>
                                <p className="flex-1 text-sm leading-relaxed text-super-securite-muted">
                                    {value.description}
                                </p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
