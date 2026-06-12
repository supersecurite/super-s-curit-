import FaqAccordionList, {
    FaqAccordionHeader,
} from '@/components/marketing/faq-accordion-list';
import Reveal from '@/components/marketing/reveal';
import { superSecuriteFaqGroups } from '@/data/super-securite-contact';

export default function ContactFaq() {
    return (
        <section className="">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <FaqAccordionHeader
                    title={
                        <>
                            Les questions{' '}
                            <span className="marketing-text-gradient">
                                qu&apos;on nous pose
                            </span>
                        </>
                    }
                />

                <div className="space-y-14">
                    {superSecuriteFaqGroups.map((group, groupIndex) => (
                        <div key={group.title}>
                            <Reveal delay={groupIndex * 40}>
                                <h3 className="font-heading mb-6 text-xl font-bold tracking-tight text-super-securite-heading sm:text-2xl">
                                    FAQ — {group.title}
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
