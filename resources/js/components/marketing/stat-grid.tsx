import Reveal from '@/components/marketing/reveal';
import { superSecuriteStats } from '@/data/super-securite-about';

export default function StatGrid() {
    return (
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {superSecuriteStats.map((stat, index) => (
                <Reveal
                    key={stat.label}
                    as="div"
                    delay={index * 80}
                    className="rounded-xl border border-super-securite-border bg-super-securite-surface/70 px-4 py-5 text-center shadow-sm backdrop-blur-sm md:text-left"
                >
                    <dt className="text-xs font-medium tracking-wide text-super-securite-muted uppercase">
                        {stat.label}
                    </dt>
                    <dd className="mt-2 font-heading text-3xl font-bold tracking-tight text-super-securite-heading md:text-4xl">
                        {stat.value}
                    </dd>
                </Reveal>
            ))}
        </dl>
    );
}
