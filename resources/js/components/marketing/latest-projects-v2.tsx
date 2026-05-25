import { useMemo, useState, type ReactNode } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
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
            <article className="relative overflow-hidden rounded-2xl bg-neutral-950 border border-white/[0.06]">
                {/* Ambient glow */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        background:
                            'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(99,102,241,0.25) 0%, transparent 70%)',
                    }}
                    aria-hidden
                />

                <div className="relative grid lg:grid-cols-5">
                    {/* Text side */}
                    <div className="flex flex-col justify-center gap-5 p-8 lg:col-span-2 lg:p-12">
                        <div className="flex items-center gap-2.5">
                            <span className="h-px w-6 bg-indigo-500" aria-hidden />
                            <span className="text-xs font-semibold tracking-[0.15em] text-indigo-400 uppercase">
                                Projet phare
                            </span>
                        </div>

                        <div>
                            <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                                {project.category}
                            </span>
                            <h3 className="mt-4 text-3xl font-bold tracking-tight text-white lg:text-4xl">
                                {project.title}
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-neutral-400 lg:text-base">
                                {project.description}
                            </p>
                        </div>

                        {project.href.startsWith('http') && (
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-indigo-500 group-hover:gap-3">
                                Explorer
                                <ArrowUpRight
                                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                                    aria-hidden
                                />
                            </span>
                        )}
                    </div>

                    {/* Image side */}
                    <div className="relative flex items-center justify-center overflow-hidden bg-neutral-900/60 p-8 lg:col-span-3 lg:p-14">
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
                                backgroundSize: '28px 28px',
                            }}
                            aria-hidden
                        />
                        <img
                            src={project.image}
                            alt={project.title}
                            className="relative max-h-60 w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 lg:max-h-80"
                            loading="lazy"
                        />
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
        <li>
            <ProjectLink
                href={project.href}
                ariaLabel={`Voir le projet ${project.title}`}
                className="group flex items-center gap-5 rounded-xl p-4 transition-all duration-200 hover:bg-white/[0.04] md:gap-7 md:p-5"
            >
                {/* Number */}
                <span
                    className="hidden w-10 shrink-0 font-mono text-2xl font-light text-neutral-700 transition-colors duration-200 group-hover:text-indigo-500 md:block"
                    aria-hidden
                >
                    {number}
                </span>

                {/* Thumbnail */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-neutral-800/70 p-2.5 transition-colors duration-200 group-hover:border-indigo-500/30">
                    <img
                        src={project.image}
                        alt=""
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                        aria-hidden
                    />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                        {project.category}
                    </p>
                    <h3 className="mt-0.5 truncate text-base font-semibold text-neutral-100">
                        {project.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                        {project.description}
                    </p>
                </div>

                {/* CTA */}
                {project.href.startsWith('http') ? (
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.06] text-neutral-500 transition-all duration-200 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                        <ExternalLink className="size-3.5" aria-hidden />
                    </span>
                ) : (
                    <span className="size-9 shrink-0" aria-hidden />
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
        <section
            id="projets"
            className="bg-neutral-950 py-24 md:py-32"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-8 bg-indigo-500" aria-hidden />
                            <span className="text-xs font-semibold tracking-[0.15em] text-indigo-400 uppercase">
                                Portfolio
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                            Produits livrés,{' '}
                            <span className="text-indigo-400">résultats concrets</span>
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-neutral-400">
                            Une sélection de plateformes web et mobiles conçues
                            pour des clients en Afrique et à l&apos;international.
                        </p>
                    </div>

                    {/* Filter tabs */}
                    <div
                        className="flex flex-wrap gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1.5"
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
                                    'cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                                    filter === cat
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                                        : 'text-neutral-400 hover:text-neutral-200',
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {filtered.length === 0 ? (
                    <p className="mt-16 text-center text-sm text-neutral-500">
                        Aucun projet dans cette catégorie pour le moment.
                    </p>
                ) : (
                    <div className="mt-14 space-y-6">
                        {spotlight && <SpotlightProject project={spotlight} />}

                        {catalogue.length > 0 && (
                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                                <div className="border-b border-white/[0.06] px-6 py-4">
                                    <span className="text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase">
                                        Autres réalisations
                                    </span>
                                </div>
                                <ul className="divide-y divide-white/[0.04] px-2 py-2">
                                    {catalogue.map((project, index) => (
                                        <CatalogueItem
                                            key={project.title}
                                            project={project}
                                            index={index}
                                        />
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}