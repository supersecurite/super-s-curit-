import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { superSecuriteImages } from '@/data/super-securite-images';
import { superSecuriteStock } from '@/data/super-securite-stock';
import Reveal from '@/components/marketing/reveal';
import { about, contact } from '@/routes';

export default function MarketingHero() {
    return (
        <section className="marketing-grid-bg relative overflow-hidden">
            <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.14]"
                style={{
                    backgroundImage: `url(${superSecuriteStock.hero.background})`,
                }}
                aria-hidden
            />
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="marketing-blob bg-super-securite-accent"
                    style={{
                        top: '-6rem',
                        left: '-4rem',
                        width: '28rem',
                        height: '28rem',
                        opacity: 0.12,
                    }}
                    aria-hidden
                />
                <div
                    className="marketing-blob bg-slate-600"
                    style={{
                        top: '20%',
                        right: '-6rem',
                        width: '24rem',
                        height: '24rem',
                        opacity: 0.1,
                        animationDelay: '-6s',
                        ['--blob-duration' as string]: '22s',
                    }}
                    aria-hidden
                />
            </div>

            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-super-securite-bg" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-16 lg:py-40">
                <div className="lg:col-span-7">
                    <Reveal delay={80}>
                        <p className="marketing-label mb-4">Super SÉCURITÉ</p>
                    </Reveal>

                    <Reveal delay={120} className="mt-2">
                        <h1 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight text-super-securite-heading md:text-5xl lg:text-6xl xl:text-7xl">
                            Confiez votre sécurité{' '}
                            <span className="relative inline-block">
                                à l&apos;excellence
                                <svg
                                    viewBox="0 0 380 22"
                                    className="marketing-underline-draw absolute -bottom-5 left-0 w-full"
                                    fill="none"
                                    preserveAspectRatio="none"
                                    aria-hidden
                                >
                                    <path
                                        d="M2 16 C 100 1, 280 1, 378 16"
                                        stroke="url(#hero-underline)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="hero-underline"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop offset="0" stopColor="#d32f2f" />
                                            <stop offset="1" stopColor="#0f172a" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={260} className="mt-8 max-w-xl">
                        <p className="text-base leading-relaxed md:text-lg">
                            Sécurité privée à Conakry : gardiennage, sites
                            industriels et miniers, sécurité événementielle.
                            Intervention 24h/24 et 7j/7.
                        </p>
                    </Reveal>

                    <Reveal
                        delay={400}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <Link
                            href={contact.url()}
                            className="marketing-cta-primary marketing-magnetic group inline-flex items-center gap-2"
                        >
                            Nous contacter
                            <ArrowRight
                                className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                                aria-hidden
                            />
                        </Link>
                        <a
                            href="#services"
                            className="marketing-cta-secondary marketing-magnetic"
                        >
                            Nos offres
                        </a>
                    </Reveal>

                    <Reveal
                        as="dl"
                        delay={560}
                        className="mt-14 grid grid-cols-3 gap-4 border-t border-super-securite-border pt-8"
                    >
                        <div>
                            <dt className="text-xs text-super-securite-muted">
                                Disponibilité
                            </dt>
                            <dd className="mt-1 font-heading text-sm font-semibold text-super-securite-heading">
                                24h/24 · 7j/7
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-super-securite-muted">
                                Zone
                            </dt>
                            <dd className="mt-1 font-heading text-sm font-semibold text-super-securite-heading">
                                Conakry &amp; Guinée
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-super-securite-muted">
                                Expertise
                            </dt>
                            <dd className="mt-1 font-heading text-sm font-semibold text-super-securite-heading">
                                Sécurité privée
                            </dd>
                        </div>
                    </Reveal>
                </div>

                <Reveal
                    delay={300}
                    variant="fade"
                    className="relative lg:col-span-5"
                >
                    <div className="relative mx-auto w-full max-w-md">
                        <div className="overflow-hidden rounded-3xl border border-super-securite-border shadow-xl shadow-slate-900/10">
                            <img
                                src={superSecuriteStock.home.welcome}
                                alt="Super Sécurité — agents de sécurité à Conakry"
                                width={640}
                                height={640}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                className="aspect-square w-full object-cover"
                            />
                        </div>
                        <div className="marketing-float absolute -bottom-4 -right-2 z-10 flex size-28 items-center justify-center rounded-2xl border border-super-securite-border bg-white p-3 shadow-lg md:-right-6 md:size-32">
                            <img
                                src={superSecuriteImages.brandtransparent}
                                alt=""
                                width={120}
                                height={120}
                                className="h-auto w-full object-contain"
                                aria-hidden
                            />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
