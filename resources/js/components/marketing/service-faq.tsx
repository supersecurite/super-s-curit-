import Reveal from '@/components/marketing/reveal';

type FaqItem = {
    question: string;
    answer: string;
};

export default function ServiceFaq({ faqs }: { faqs: readonly FaqItem[] }) {
    if (faqs.length === 0) {
        return null;
    }

    return (
        <section className="border-t border-super-securite-border bg-super-securite-surface py-10">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <h2 className="font-heading text-center text-2xl font-bold tracking-tight text-super-securite-heading md:text-3xl">
                        Questions fréquentes
                    </h2>
                </Reveal>
                <dl className="mt-10 space-y-6">
                    {faqs.map((faq, index) => (
                        <Reveal key={faq.question} delay={index * 80}>
                            <div className="marketing-card">
                                <dt className="font-heading text-base font-semibold text-super-securite-heading">
                                    {faq.question}
                                </dt>
                                <dd className="mt-3 text-sm leading-relaxed text-super-securite-muted">
                                    {faq.answer}
                                </dd>
                            </div>
                        </Reveal>
                    ))}
                </dl>
            </div>
        </section>
    );
}
