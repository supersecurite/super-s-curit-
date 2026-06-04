import { useState } from 'react';
import Reveal from '@/components/marketing/reveal';
import {
    superSecuriteTechStack,
    techStackTabs,
    type TechStackCategory,
} from '@/data/super-securite-content';
import { cn } from '@/lib/utils';

export default function TechStack() {
    const [activeTab, setActiveTab] = useState<TechStackCategory>('frontend');
    const items = superSecuriteTechStack[activeTab];

    return (
        <section className="border-y border-super-securite-border bg-super-securite-surface-elevated/80 py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-10 max-w-2xl">
                    <p className="marketing-label mb-3">Technologies</p>
                    <h2 className="marketing-heading-section">
                        Notre cœur de{' '}
                        <span className="marketing-text-gradient">métier</span>
                    </h2>
                </Reveal>

                <Reveal
                    delay={120}
                    className="mb-8 flex flex-wrap gap-1 rounded-xl border border-super-securite-border bg-super-securite-surface p-1 shadow-sm w-fit"
                >
                    <div
                        className="flex flex-wrap gap-1"
                        role="tablist"
                        aria-label="Catégories de technologies"
                    >
                        {techStackTabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-super-securite-accent',
                                    activeTab === tab.id
                                        ? 'bg-super-securite-heading text-super-securite-surface shadow-sm'
                                        : 'text-super-securite-muted hover:text-super-securite-heading',
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </Reveal>

                <Reveal delay={240}>
                    <div
                        key={activeTab}
                        role="tabpanel"
                        className="marketing-card grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                    >
                        {items.map((item, i) => (
                            <div
                                key={item.label}
                                className="group flex flex-col items-center gap-3 text-center"
                                style={{
                                    animation:
                                        'tech-stagger 500ms cubic-bezier(0.16,1,0.3,1) backwards',
                                    animationDelay: `${i * 60}ms`,
                                }}
                            >
                                <div className="flex size-14 items-center justify-center rounded-xl bg-super-securite-surface-elevated transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                                    <img
                                        src={item.path}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 object-contain"
                                        aria-hidden
                                    />
                                </div>
                                <span className="text-xs font-medium text-super-securite-heading">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>

            <style>{`
                @keyframes tech-stagger {
                    from { opacity: 0; transform: translate3d(0, 12px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    [style*="tech-stagger"] { animation: none !important; opacity: 1 !important; transform: none !important; }
                }
            `}</style>
        </section>
    );
}
