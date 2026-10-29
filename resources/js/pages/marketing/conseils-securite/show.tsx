import { Head, usePage } from '@inertiajs/react';
import CmsLocaleNotice from '@/components/marketing/cms-locale-notice';
import ResourceV2Detail from '@/components/marketing/resource-v2-detail';
import SeoHead from '@/components/marketing/seo-head';
import type { MarketingContentImageSource } from '@/types/marketing-content';

type SecurityTipDetail = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    image_source?: MarketingContentImageSource | null;
    category: string | null;
    views: number;
    read_time: number;
    formatted_read_time: string;
    published_at_formatted: string | null;
    is_locale_fallback?: boolean;
};

type RelatedSecurityTip = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    image_source?: MarketingContentImageSource | null;
    published_at_formatted: string | null;
};

type PageProps = {
    securityTip: SecurityTipDetail;
    securityTipContent: string | null;
    relatedSecurityTips: RelatedSecurityTip[];
};

export default function ResourceShow() {
    const { securityTip, securityTipContent, relatedSecurityTips } =
        usePage<PageProps>().props;

    return (
        <>
            <SeoHead />
            <CmsLocaleNotice show={securityTip.is_locale_fallback !== false} />
            <Head title={securityTip.title} />
            <ResourceV2Detail
                kind="tips"
                item={securityTip}
                content={securityTipContent}
                related={relatedSecurityTips}
            />
        </>
    );
}
