import { Head } from '@inertiajs/react';
import CtaBand from '@/components/marketing/cta-band';
import LatestProjects from '@/components/marketing/latest-projects';
import MarketingHero from '@/components/marketing/marketing-hero';
import ServiceCards from '@/components/marketing/service-cards';
import TechMarquee from '@/components/marketing/tech-marquee';
import TechStack from '@/components/marketing/tech-stack';
import { aristechImages } from '@/data/aristech-images';

export default function MarketingHome() {
    return (
        <>
            <Head>
                <title>ArisTech — Développement web &amp; mobile</title>
                <meta
                    name="description"
                    content="ArisTech conçoit des applications web et mobiles, des sites internet modernes et intègre des API pour simplifier votre présence numérique."
                />
                <meta
                    property="og:title"
                    content="ArisTech — Développement web & mobile"
                />
                <meta
                    property="og:description"
                    content="Votre vision, notre expertise. Applications, sites web et intégration d'API."
                />
                <meta property="og:image" content={aristechImages.ogDefault} />
                <meta property="og:type" content="website" />
            </Head>

            <MarketingHero />
            <TechMarquee />
            <ServiceCards />
            <LatestProjects />
            <TechStack />
            <CtaBand />
        </>
    );
}
