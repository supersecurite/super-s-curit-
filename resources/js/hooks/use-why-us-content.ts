import {
    superSecuriteWhyUsDetails,
    superSecuriteWhyUsModern,
} from '@/data/super-securite-content';
import { useTrans } from '@/hooks/use-trans';

type DetailCopy = {
    title?: string;
    description?: string;
    image_alt?: string;
};

/**
 * Copy « Pourquoi nous » localisée (accueil + page à propos).
 */
export function useWhyUsContent() {
    const { t, tList, tNode } = useTrans();

    const reasons = tList(
        'why_us.reasons',
        [...superSecuriteWhyUsModern.reasons],
    );
    const appFeatures = tList(
        'why_us.app_features',
        superSecuriteWhyUsModern.appFeatures.map((feature) => feature.label),
    );
    const detailsCopy = tNode<DetailCopy[]>('why_us.details', []);

    const details = superSecuriteWhyUsDetails.map((item, index) => ({
        ...item,
        title: detailsCopy[index]?.title ?? item.title,
        description: detailsCopy[index]?.description ?? item.description,
        imageAlt: detailsCopy[index]?.image_alt ?? item.imageAlt,
    }));

    return {
        sectionLabel: t(
            'why_us.section_label',
            superSecuriteWhyUsModern.sectionLabel,
        ),
        title: t('why_us.title', superSecuriteWhyUsModern.title),
        intro: t('why_us.intro', superSecuriteWhyUsModern.intro),
        appSectionTitle: t(
            'why_us.app_section_title',
            superSecuriteWhyUsModern.appSectionTitle,
        ),
        appLead: t('why_us.app_lead', superSecuriteWhyUsModern.appLead),
        conclusion: t(
            'why_us.conclusion',
            superSecuriteWhyUsModern.conclusion,
        ),
        reasons,
        appFeatures: superSecuriteWhyUsModern.appFeatures.map(
            (feature, index) => ({
                ...feature,
                label: appFeatures[index] ?? feature.label,
            }),
        ),
        details,
    };
}
