import { useMemo, useState, type ReactNode } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { aristechProjects } from '@/data/aristech-content';
import { cn } from '@/lib/utils';

function ProjectLink({
    href,
    className,
    children,
    ariaLabel,
}: {
    href: string;
    className?: string;
    children: ReactNode;
    ariaLabel: string;
}) {
    const isExternal = href.startsWith('http');

    if (!isExternal) {
        return <div className={className}>{children}</div>;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={cn('cursor-pointer', className)}
        >
            {children}
        </a>
    );
}

function SpotlightProject({
    project,
}: {
    project: (typeof aristechProjects)[number];
}) {
    return (
        <ProjectLink
            href={project.href}
            ariaLabel={`Voir le projet ${project.title}`}
            className="group block"
        >
            <article className="overflow-hidden rounded-3xl border border-aristech-border bg-aristech-surface shadow-lg shadow-slate-900/8 transition-colors duration-200 group-hover:border-aristech-accent/50">
                <div className="grid lg:grid-cols-12">
                    <div className="flex items-center justify-center bg-aristech-surface-elevated p-8 lg:col-span-7 lg:p-12">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="max-h-48 w-full object-contain transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 lg:max-h-64"
                            loading="lazy"
                        />
                    </div>
                    <div className="flex flex-col justify-center border-t border-aristech-border p-8 lg:col-span-5 lg:border-t-0 lg:border-l">
                        <span className="marketing-label mb-4">Projet phare</span>
                        <span className="inline-flex w-fit rounded-md bg-aristech-accent/10 px-2.5 py-1 text-xs font-semibold text-aristech-accent">
                            {project.category}
                        </span>
                        <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-aristech-heading md:text-3xl">
                            {project.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed md:text-base">
                            {project.description}
                        </p>
                        {project.href.startsWith('http') && (
                            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aristech-accent transition-colors duration-200 group-hover:text-aristech-accent-hover">
                                Explorer le projet
                                <ArrowUpRight
                                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                                    aria-hidden
                                />
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </ProjectLink>
    );
}

function CatalogueItem({
    project,
    index,
}: {
    project: (typeof aristechProjects)[number];
    index: number;
}) {
    const number = String(index + 1).padStart(2, '0');

    return (
        <li className="border-b border-aristech-border last:border-b-0">
            <ProjectLink
                href={project.href}
                ariaLabel={`Voir le projet ${project.title}`}
                className="group grid gap-6 py-8 transition-colors duration-200 hover:bg-aristech-surface/60 md:grid-cols-[4.5rem_11rem_1fr_auto] md:items-center md:gap-8 md:py-10"
            >
                <span
                    className="font-heading text-4xl font-light text-aristech-border transition-colors duration-200 group-hover:text-aristech-accent md:text-5xl"
                    aria-hidden
                >
                    {number}
                </span>

                <div className="flex aspect-video items-center justify-center rounded-xl border border-aristech-border bg-aristech-surface-elevated p-4 md:aspect-square">
                    <img
                        src={project.image}
                        alt=""
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                        aria-hidden
                    />
                </div>

                <div className="min-w-0">
                    <span className="text-xs font-semibold tracking-wide text-aristech-muted uppercase">
                        {project.category}
                    </span>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-aristech-heading">
                        {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed md:line-clamp-none">
                        {project.description}
                    </p>
                </div>

                {project.href.startsWith('http') ? (
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-aristech-border bg-aristech-surface text-aristech-heading transition-colors duration-200 group-hover:border-aristech-accent group-hover:bg-aristech-accent group-hover:text-white">
                        <ExternalLink className="size-4" aria-hidden />
                    </span>
                ) : (
                    <span className="size-11 shrink-0" aria-hidden />
                )}
            </ProjectLink>
        </li>
    );
}

export default function LatestProjects() {
    const categories = useMemo(
        () => [
            'Tous',
            ...Array.from(new Set(aristechProjects.map((p) => p.category))),
        ],
        [],
    );

    const [filter, setFilter] = useState('Tous');

    const filtered = useMemo(
        () =>
            filter === 'Tous'
                ? aristechProjects
                : aristechProjects.filter((p) => p.category === filter),
        [filter],
    );

    const spotlight = useMemo(
        () => filtered.find((p) => p.featured),
        [filtered],
    );

    const catalogue = useMemo(
        () =>
            spotlight
                ? filtered.filter((p) => p.title !== spotlight.title)
                : filtered,
        [filtered, spotlight],
    );

    return (
        <section id="projets" className="border-t border-aristech-border py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="marketing-label mb-3">Portfolio</p>
                        <h2 className="marketing-heading-section">
                            Nos{' '}
                            <span className="marketing-text-gradient">Réalisations</span>
                        </h2>
                        <p className="mt-3 text-sm md:text-base">
                            Une sélection de plateformes web et mobiles conçues
                            pour des clients en Afrique et à l&apos;international.
                        </p>
                    </div>

                    <div
                        className="flex flex-wrap gap-1 rounded-xl border border-aristech-border bg-aristech-surface p-1 shadow-sm"
                        role="tablist"
                        aria-label="Filtrer les projets par catégorie"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                aria-selected={filter === cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    'cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aristech-accent',
                                    filter === cat
                                        ? 'bg-aristech-heading text-aristech-surface'
                                        : 'text-aristech-muted hover:text-aristech-heading',
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </Reveal>

                {filtered.length === 0 ? (
                    <p className="mt-12 text-center text-sm text-aristech-muted">
                        Aucun projet dans cette catégorie pour le moment.
                    </p>
                ) : (
                    <div className="mt-12 space-y-12">
                        {spotlight && (
                            <Reveal delay={120}>
                                <SpotlightProject project={spotlight} />
                            </Reveal>
                        )}

                        {catalogue.length > 0 && (
                            <Reveal delay={200}>
                                <h3 className="mb-6 font-heading text-sm font-semibold tracking-wide text-aristech-muted uppercase">
                                    Autres réalisations
                                </h3>
                                <ul className="rounded-2xl border border-aristech-border bg-aristech-surface/80 px-4 md:px-8">
                                    {catalogue.map((project, index) => (
                                        <CatalogueItem
                                            key={project.title}
                                            project={project}
                                            index={index}
                                        />
                                    ))}
                                </ul>
                            </Reveal>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
