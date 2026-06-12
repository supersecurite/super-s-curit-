import { Plus } from 'lucide-react';
import Reveal from '@/components/marketing/reveal';
import { cn } from '@/lib/utils';

export type FaqAccordionItem = {
    question: string;
    answer: string;
};

type FaqAccordionListProps = {
    faqs: readonly FaqAccordionItem[];
    className?: string;
    delayOffset?: number;
};

export default function FaqAccordionList({
    faqs,
    className,
    delayOffset = 0,
}: FaqAccordionListProps) {
    if (faqs.length === 0) {
        return null;
    }

    return (
        <div className={cn('space-y-3', className)}>
            {faqs.map((faq, index) => (
                <Reveal key={faq.question} delay={delayOffset + index * 60}>
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
    );
}

export function FaqAccordionHeader({
    label = 'FAQ',
    title,
    className,
}: {
    label?: string;
    title: React.ReactNode;
    className?: string;
}) {
    return (
        <Reveal className={cn('mb-10 text-center md:mb-12', className)}>
            <p className="marketing-label mb-3">{label}</p>
            <h2 className="marketing-heading-section">{title}</h2>
        </Reveal>
    );
}
