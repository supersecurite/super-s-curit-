import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { aristechImages } from '@/data/aristech-images';
import Reveal from '@/components/marketing/reveal';
import RotatingWords from '@/components/marketing/rotating-words';
import { contact } from '@/routes';

const verbs = ['Créez', 'Renforcez', 'Optimisez', 'Propulsez'] as const;

export default function MarketingHero() {
    return (
        <section className="marketing-grid-bg relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="marketing-blob bg-aristech-accent"
                    style={{
                        top: '-6rem',
                        left: '-4rem',
                        width: '28rem',
                        height: '28rem',
                        opacity: 0.18,
                    }}
                    aria-hidden
                />
                <div
                    className="marketing-blob bg-sky-400"
                    style={{
                        top: '20%',
                        right: '-6rem',
                        width: '24rem',
                        height: '24rem',
                        opacity: 0.18,
                        animationDelay: '-6s',
                        ['--blob-duration' as string]: '22s',
                    }}
                    aria-hidden
                />
                <div
                    className="marketing-blob bg-indigo-400"
                    style={{
                        bottom: '-6rem',
                        left: '30%',
                        width: '22rem',
                        height: '22rem',
                        opacity: 0.15,
                        animationDelay: '-12s',
                    }}
                    aria-hidden
                />
            </div>

            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-aristech-bg" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-16 lg:py-40">
                <div className="lg:col-span-7">
                    <Reveal delay={120} className="mt-6">
                        <h1 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight text-aristech-heading md:text-5xl lg:text-6xl xl:text-7xl">
                            <span className="block">
                                <RotatingWords words={verbs} />
                                {' '}
                                votre{' '}
                                <span className="relative inline-block">
                                    présence digitale
                                    <svg
                                        viewBox="0 0 380 18"
                                        className="marketing-underline-draw absolute -bottom-2 left-0 w-full"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        aria-hidden
                                    >
                                        <path
                                            d="M2 14 C 80 4, 200 4, 378 12"
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
                                                <stop offset="0" stopColor="#16a34a" />
                                                <stop offset="1" stopColor="#0ea5e9" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </span>
                            <span className="mt-2 block text-aristech-muted">
                                avec ArisTech.
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={260} className="mt-8 max-w-xl">
                        <p className="text-base leading-relaxed md:text-lg">
                            Applications web et mobiles, sites sur mesure et
                            intégrations API. Une expertise technique claire,
                            livrée avec rigueur — du design au déploiement.
                        </p>
                    </Reveal>

                    <Reveal delay={400} className="mt-10 flex flex-wrap items-center gap-4">
                        <Link
                            href={contact.url()}
                            className="marketing-cta-primary marketing-magnetic group inline-flex items-center gap-2"
                        >
                            Démarrer un projet
                            <ArrowRight
                                className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                                aria-hidden
                            />
                        </Link>
                        <a
                            href="#projets"
                            className="marketing-cta-secondary marketing-magnetic"
                        >
                            Voir nos réalisations
                        </a>
                    </Reveal>

                    <Reveal
                        delay={560}
                        className="mt-14 grid grid-cols-3 gap-4 border-t border-aristech-border pt-8"
                    >
                        <div>
                            <dt className="text-xs text-aristech-muted">
                                Focus
                            </dt>
                            <dd className="mt-1 font-heading text-sm font-semibold text-aristech-heading">
                                Web &amp; mobile
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-aristech-muted">
                                CMS
                            </dt>
                            <dd className="mt-1 font-heading text-sm font-semibold text-aristech-heading">
                                WordPress · Shopify
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-aristech-muted">
                                Modèle
                            </dt>
                            <dd className="mt-1 font-heading text-sm font-semibold text-aristech-heading">
                                Sur mesure
                            </dd>
                        </div>
                    </Reveal>
                </div>

                <Reveal
                    delay={300}
                    variant="fade"
                    className="relative lg:col-span-5"
                >
                    <div className="relative mx-auto aspect-square w-full max-w-md">
                        <div
                            className="absolute inset-8 rounded-full border-2 border-dashed border-aristech-border opacity-60"
                            aria-hidden
                        />
                        <div
                            className="absolute inset-16 rounded-full border border-aristech-accent/30"
                            aria-hidden
                        />
                        <div className="marketing-float relative flex h-full items-center justify-center">
                            <img
                                src={aristechImages.brand}
                                alt="Logo ArisTech"
                                width={320}
                                height={320}
                                className="relative z-10 h-auto w-3/4 max-w-xs object-contain drop-shadow-2xl"
                                fetchPriority="high"
                            />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
