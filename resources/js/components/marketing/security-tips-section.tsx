import { Shield } from 'lucide-react';
import MarketingContentListSection from '@/components/marketing/marketing-content-list-section';
import {
    index as conseilsIndex,
    show as conseilsShow,
} from '@/routes/conseils-securite';
import { useTrans } from '@/hooks/use-trans';
import { localizePath } from '@/lib/locale-url';
import type { MarketingContentPreview } from '@/types/marketing-content';

type SecurityTipsSectionProps = {
    tips: MarketingContentPreview[];
};

export default function SecurityTipsSection({
    tips,
}: SecurityTipsSectionProps) {
    const { t, locale } = useTrans();
    const lp = (path: string) => localizePath(path, locale);

    return (
        <MarketingContentListSection
            id="conseils"
            label={t('home.tips_label', 'Conseils')}
            title={t('home.tips_title', 'Conseils de sécurité')}
            description={t('tips.description', 'Des recommandations pratiques pour renforcer la sécurité de vos locaux, événements et équipes.')}
            indexHref={lp(conseilsIndex.url())}
            indexLabel={t('tips.view_all', 'Voir tous les conseils')}
            items={tips}
            itemHref={(slug) => lp(conseilsShow.url(slug))}
            readLabel={t('tips.read', 'Lire le conseil')}
            fallbackIcon={Shield}
        />
    );
}
