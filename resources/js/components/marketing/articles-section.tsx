import { Newspaper } from 'lucide-react';
import MarketingContentListSection from '@/components/marketing/marketing-content-list-section';
import { index as actualitesIndex, show as actualitesShow } from '@/routes/actualites';
import type { MarketingContentPreview } from '@/types/marketing-content';

type ArticlesSectionProps = {
    articles: MarketingContentPreview[];
};

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
    return (
        <MarketingContentListSection
            id="actualites"
            label="Actualités"
            title="Nos dernières actualités"
            description="Missions sur le terrain, retours d'expérience et nouveautés de Super Sécurité."
            indexHref={actualitesIndex.url()}
            indexLabel="Voir toutes les actualités"
            items={articles}
            itemHref={(slug) => actualitesShow.url(slug)}
            readLabel="Lire l'article"
            fallbackIcon={Newspaper}
        />
    );
}
