import { useEffect, type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import BackToTop from '@/components/marketing/back-to-top';
import MarketingFooter from '@/components/marketing/marketing-footer';
import MarketingHeader from '@/components/marketing/marketing-header';
import { useTrans } from '@/hooks/use-trans';
import { useVisitTracker } from '@/hooks/use-visit-tracker';

export default function MarketingLayout({ children }: { children: ReactNode }) {
    useVisitTracker();
    const { url } = usePage();
    const { locale = 'fr' } = usePage().props as { locale?: string };
    const { t } = useTrans();

    useEffect(() => {
        const hash = url.split('#')[1];

        if (!hash) {
            return;
        }

        const frame = window.requestAnimationFrame(() => {
            document
                .getElementById(decodeURIComponent(hash))
                ?.scrollIntoView({ block: 'start' });
        });

        return () => {
            window.cancelAnimationFrame(frame);
        };
    }, [url]);

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.classList.add('marketing-page');
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        document.documentElement.style.backgroundColor = '#e8ecf1';
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            document.documentElement.classList.remove('marketing-page');
            document.documentElement.style.colorScheme = '';
            document.documentElement.style.backgroundColor = '';
            document.documentElement.style.scrollBehavior = '';
        };
    }, [locale]);

    return (
        <div className="marketing-site flex min-h-screen flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-super-securite-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                {t('common.skip_to_content', 'Aller au contenu')}
            </a>
            <MarketingHeader />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <MarketingFooter />
            <BackToTop />
            <Toaster />
        </div>
    );
}
