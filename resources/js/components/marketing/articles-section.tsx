import { Newspaper } from 'lucide-react';
import MarketingContentListSection from '@/components/marketing/marketing-content-list-section';
import { index as actualitesIndex, show as actualitesShow } from '@/routes/actualites';
import { useTrans } from '@/hooks/use-trans';
import { localizePath } from '@/lib/locale-url';
import type { MarketingContentPreview } from '@/types/marketing-content';

type ArticlesSectionProps = {
    articles: MarketingContentPreview[];
};

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
    const { t, locale } = useTrans();
    const lp = (path: string) => localizePath(path, locale);

    return (
        <MarketingContentListSection
            id="actualites"
            label={t('home.articles_label', 'Actualités')}
            title={t('home.articles_title', 'Nos dernières actualités')}
            description={t('articles.description', "Missions sur le terrain, retours d'expérience et nouveautés de Super Sécurité.")}
            indexHref={lp(actualitesIndex.url())}
            indexLabel={t('articles.view_all', 'Voir toutes les actualités')}
            items={articles}
            itemHref={(slug) => lp(actualitesShow.url(slug))}
            readLabel={t('articles.read', "Lire l'article")}
            fallbackIcon={Newspaper}
        />
    );
}
