import Reveal from '@/components/marketing/reveal';
import { aristechStory } from '@/data/aristech-about';
import { aristechStock } from '@/data/aristech-stock';

export default function StorySection() {
    return (
        <section className="py-24 md:py-32">
            <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-8">
                <Reveal className="lg:col-span-5">
                    <p className="marketing-label mb-3">Notre histoire</p>
                    <h2 className="marketing-heading-section">
                        D&apos;un atelier solo à{' '}
                        <span className="marketing-text-gradient">
                            un studio reconnu
                        </span>
                    </h2>
                    <p className="mt-6 text-base leading-relaxed">
                        ArisTech est née d&apos;une conviction : la technologie
                        doit servir des projets ambitieux sans complexité
                        inutile. Depuis 2020, nous concevons des produits
                        numériques pour des entrepreneurs, des PME et des
                        organisations qui veulent avancer vite et bien.
                    </p>
                    <p className="mt-4 text-base leading-relaxed">
                        Aujourd&apos;hui, c&apos;est un studio agile, capable de
                        s&apos;entourer d&apos;experts ponctuels pour répondre à
                        des projets de toute envergure.
                    </p>

                    <div className="mt-8 overflow-hidden rounded-2xl border border-aristech-border shadow-md shadow-slate-900/5">
                        <img
                            src={aristechStock.about.story}
                            alt="Maquettes et wireframes sur un bureau ArisTech"
                            width={900}
                            height={600}
                            loading="lazy"
                            className="aspect-[3/2] h-auto w-full object-cover"
                        />
                    </div>
                </Reveal>

                <div className="lg:col-span-7">
                    <ol className="relative space-y-10 border-l-2 border-dashed border-aristech-border pl-8">
                        {aristechStory.map((chapter, index) => (
                            <Reveal
                                key={chapter.year}
                                delay={index * 120}
                                className="relative"
                            >
                                <li className="relative">
                                    <span
                                        className="absolute top-1 -left-[2.4rem] flex size-4 items-center justify-center rounded-full border-2 border-aristech-accent bg-aristech-bg"
                                        aria-hidden
                                    >
                                        <span className="size-1.5 rounded-full bg-aristech-accent" />
                                    </span>
                                    <div className="flex flex-wrap items-baseline gap-3">
                                        <span className="font-heading text-lg font-bold text-aristech-accent">
                                            {chapter.year}
                                        </span>
                                        <h3 className="font-heading text-xl font-semibold text-aristech-heading">
                                            {chapter.title}
                                        </h3>
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed md:text-base">
                                        {chapter.description}
                                    </p>
                                </li>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
