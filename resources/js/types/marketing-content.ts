export type MarketingContentImageSource = 'storage' | 'public' | 'external';

export type MarketingContentPreview = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    image_source?: MarketingContentImageSource | null;
    category: string | null;
    read_time: number;
    published_at_formatted: string | null;
};
