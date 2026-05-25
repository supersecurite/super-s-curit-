import Reveal from '@/components/marketing/reveal';
import { aristechStats } from '@/data/aristech-about';

export default function StatGrid() {
    return (
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {aristechStats.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 80}>
                    <div className="rounded-xl border border-aristech-border bg-aristech-surface/70 px-4 py-5 text-center shadow-sm backdrop-blur-sm md:text-left">
                        <dt className="text-xs font-medium tracking-wide text-aristech-muted uppercase">
                            {stat.label}
                        </dt>
                        <dd className="mt-2 font-heading text-3xl font-bold tracking-tight text-aristech-heading md:text-4xl">
                            {stat.value}
                        </dd>
                    </div>
                </Reveal>
            ))}
        </dl>
    );
}
