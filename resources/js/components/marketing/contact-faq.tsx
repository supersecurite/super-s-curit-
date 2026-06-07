import { Plus } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteFaqs } from '@/data/super-securite-contact';

export default function ContactFaq() {
    return (
        <section className="">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 text-center">
                    <p className="marketing-label mb-3">FAQ</p>
                    <h2 className="marketing-heading-section">
                        Les questions{' '}
                        <span className="marketing-text-gradient">qu&apos;on nous pose</span>
                    </h2>
                </Reveal>

                <div className="space-y-3">
                    {superSecuriteFaqs.map((faq, index) => (
                        <Reveal key={faq.question} delay={index * 80}>
                            <details className="group rounded-2xl border border-super-securite-border bg-super-securite-surface shadow-sm shadow-slate-900/5 transition-colors duration-200 open:border-super-securite-accent/40 hover:border-super-securite-accent/40">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 md:px-7 md:py-6">
                                    <span className="font-heading text-base font-semibold text-super-securite-heading md:text-lg">
                                        {faq.question}
                                    </span>
                                    <span
                                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-super-securite-border bg-super-securite-bg text-super-securite-heading transition-transform duration-300 group-open:rotate-45 group-open:border-super-securite-accent group-open:bg-super-securite-accent group-open:text-white motion-reduce:transition-none motion-reduce:group-open:rotate-0"
                                        aria-hidden
                                    >
                                        <Plus className="size-4" />
                                    </span>
                                </summary>

                                <div className="px-5 pb-6 md:px-7">
                                    <p className="text-sm leading-relaxed text-super-securite-text md:text-base">
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
