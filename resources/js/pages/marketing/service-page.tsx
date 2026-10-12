import { usePage } from '@inertiajs/react';
import SeoHead from '@/components/marketing/seo-head';
import { servicePageLayouts } from '@/components/marketing/service-layouts';
import type { SuperSecuriteServiceId } from '@/data/super-securite-services';
import { useLocalizedServicePage } from '@/hooks/use-localized-service-page';

import type { GalleryImagePublic, GalleryVideoPublic } from '@/types/gallery';

type PageProps = {
    pageFaqs: { question: string; answer: string }[];
    serviceId: SuperSecuriteServiceId;
    galleryImages: GalleryImagePublic[];
    galleryVideos: GalleryVideoPublic[];
};

export default function ServicePage() {
    const { serviceId, pageFaqs, galleryImages, galleryVideos } =
        usePage<PageProps>().props;
    const content = useLocalizedServicePage(serviceId);
    const Layout = servicePageLayouts[serviceId];

    return (
        <>
            <SeoHead />
            <Layout
                content={content}
                faqs={pageFaqs}
                serviceGalleryImages={galleryImages}
                serviceGalleryVideos={galleryVideos}
            />
        </>
    );
}
