export type MarketingContentPreview = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    category: string | null;
    read_time: number;
    published_at_formatted: string | null;
};
