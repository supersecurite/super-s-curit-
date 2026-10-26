import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import FaqAccordionList, {
    FaqAccordionHeader,
    type FaqAccordionItem,
} from '@/components/marketing/faq-accordion-list';

export default function ServiceFaq({
    faqs,
}: {
    faqs: readonly FaqAccordionItem[];
}) {
    const { t: uiText } = useUiTranslations();

    if (faqs.length === 0) {
        return null;
    }

    return (
        <section className="border-t border-super-securite-border bg-super-securite-surface py-14 md:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <FaqAccordionHeader
                    title={
                        <>
                            {uiText(
                                'ui.components.text_9a72221a2747',
                                'Questions',
                            )}{' '}
                            <span className="text-black">
                                {uiText(
                                    'ui.components.text_95cebc3a7e56',
                                    'fréquentes',
                                )}
                            </span>
                        </>
                    }
                />

                <FaqAccordionList faqs={faqs} />
            </div>
        </section>
    );
}
