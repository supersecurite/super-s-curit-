import { useEffect, type ReactNode } from 'react';
import BackToTop from '@/components/marketing/back-to-top';
import MarketingFooter from '@/components/marketing/marketing-footer';
import MarketingHeader from '@/components/marketing/marketing-header';
import { useVisitTracker } from '@/hooks/use-visit-tracker';
import { Head } from '@inertiajs/react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
    useVisitTracker();

    useEffect(() => {
        document.documentElement.lang = 'fr';
        document.documentElement.classList.add('marketing-page');
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        document.documentElement.style.backgroundColor = '#dce3ec';
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            document.documentElement.classList.remove('marketing-page');
            document.documentElement.style.colorScheme = '';
            document.documentElement.style.backgroundColor = '';
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    return (
        <>
            <Head>
                <script src="https://analytics.ahrefs.com/analytics.js" data-key="aeIyQftV2tqhVjscqcASrg" async></script>
            </Head>
        <div className="marketing-site flex min-h-screen flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-aristech-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                Aller au contenu
            </a>
            <MarketingHeader />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <MarketingFooter />
            <BackToTop />
        </div>
        </>
    );
}
