import { superSecuriteMissionBlocks } from '@/data/super-securite-about';

export default function MissionSection() {
    return (
        <section className="py-10">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
                {superSecuriteMissionBlocks.map((block) => (
                    <article key={block.title} className="marketing-card">
                        <h2 className="font-heading text-xl font-semibold text-super-securite-heading">
                            {block.title}
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed md:text-base">
                            {block.content}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}
