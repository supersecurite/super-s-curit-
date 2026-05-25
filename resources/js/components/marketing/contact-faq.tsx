import { Plus } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { aristechFaqs } from '@/data/aristech-contact';

export default function ContactFaq() {
    return (
        <section className="py-24 md:py-32">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 text-center">
                    <p className="marketing-label mb-3">FAQ</p>
                    <h2 className="marketing-heading-section">
                        Les questions{' '}
                        <span className="marketing-text-gradient">qu&apos;on nous pose</span>
                    </h2>
                </Reveal>

                <div className="space-y-3">
                    {aristechFaqs.map((faq, index) => (
                        <Reveal key={faq.question} delay={index * 80}>
                            <details className="group rounded-2xl border border-aristech-border bg-aristech-surface shadow-sm shadow-slate-900/5 transition-colors duration-200 open:border-aristech-accent/40 hover:border-aristech-accent/40">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 md:px-7 md:py-6">
                                    <span className="font-heading text-base font-semibold text-aristech-heading md:text-lg">
                                        {faq.question}
                                    </span>
                                    <span
                                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-aristech-border bg-aristech-bg text-aristech-heading transition-transform duration-300 group-open:rotate-45 group-open:border-aristech-accent group-open:bg-aristech-accent group-open:text-white motion-reduce:transition-none motion-reduce:group-open:rotate-0"
                                        aria-hidden
                                    >
                                        <Plus className="size-4" />
                                    </span>
                                </summary>

                                <div className="px-5 pb-6 md:px-7">
                                    <p className="text-sm leading-relaxed text-aristech-text md:text-base">
                                        {faq.answer}
                                    </p>
                                </div>
                            </details>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
