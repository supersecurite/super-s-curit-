import type { ServicePageContent } from '@/data/super-securite-service-pages';
import type { GalleryImagePublic, GalleryVideoPublic } from '@/types/gallery';

export type ServicePageLayoutProps = {
    content: ServicePageContent;
    faqs: readonly { question: string; answer: string }[];
    serviceGalleryImages?: readonly GalleryImagePublic[];
    serviceGalleryVideos?: readonly GalleryVideoPublic[];
};
