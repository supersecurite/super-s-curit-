import FaqAccordionList, {
    FaqAccordionHeader,
} from '@/components/marketing/faq-accordion-list';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteFaqGroups } from '@/data/super-securite-contact';
import { useTrans } from '@/hooks/use-trans';

type FaqGroup = {
    title: string;
    faqs: Array<{ question: string; answer: string }>;
};

export default function ContactFaq() {
    const { t, tNode } = useTrans();
    const faqGroups = tNode<FaqGroup[]>(
        'contact.faq_groups',
        superSecuriteFaqGroups as unknown as FaqGroup[],
    );

    return (
        <section id="faq" className="">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <FaqAccordionHeader
                    title={
                        <>
                            {t('contact.faq_title_lead', 'Les questions')}{' '}
                            <span className="text-black">
                                {t(
                                    'contact.faq_title_highlight',
                                    "qu'on nous pose",
                                )}
                            </span>
                        </>
                    }
                />

                <div className="space-y-14">
                    {faqGroups.map((group, groupIndex) => (
                        <div key={group.title}>
                            <Reveal delay={groupIndex * 40}>
                                <h3 className="font-heading mb-6 text-xl font-bold tracking-tight text-super-securite-heading sm:text-2xl">
                                    {t('contact.faq_prefix', 'FAQ —')}{' '}
                                    {group.title}
                                </h3>
                            </Reveal>

                            <FaqAccordionList
                                faqs={group.faqs}
                                delayOffset={groupIndex * 40}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
