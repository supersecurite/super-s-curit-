import { Shield } from 'lucide-react';
import MarketingContentListSection from '@/components/marketing/marketing-content-list-section';
import {
    index as conseilsIndex,
    show as conseilsShow,
} from '@/routes/conseils-securite';
import type { MarketingContentPreview } from '@/types/marketing-content';

type SecurityTipsSectionProps = {
    tips: MarketingContentPreview[];
};

export default function SecurityTipsSection({
    tips,
}: SecurityTipsSectionProps) {
    return (
        <MarketingContentListSection
            id="conseils"
            label="Conseils de sécurité"
            title="Protégez ce qui compte"
            description="Des recommandations pratiques pour renforcer la sécurité de vos locaux, événements et équipes."
            indexHref={conseilsIndex.url()}
            indexLabel="Voir tous les conseils"
            items={tips}
            itemHref={(slug) => conseilsShow.url(slug)}
            readLabel="Lire le conseil"
            fallbackIcon={Shield}
        />
    );
}
