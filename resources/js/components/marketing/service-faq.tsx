import FaqAccordionList, {
    FaqAccordionHeader,
    type FaqAccordionItem,
} from '@/components/marketing/faq-accordion-list';

export default function ServiceFaq({
    faqs,
}: {
    faqs: readonly FaqAccordionItem[];
}) {
    if (faqs.length === 0) {
        return null;
    }

    return (
        <section className="border-t border-super-securite-border bg-super-securite-surface py-14 md:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <FaqAccordionHeader
                    title={
                        <>
                            Questions{' '}
                            <span className="text-black">
                                fréquentes
                            </span>
                        </>
                    }
                />

                <FaqAccordionList faqs={faqs} />
            </div>
        </section>
    );
}
