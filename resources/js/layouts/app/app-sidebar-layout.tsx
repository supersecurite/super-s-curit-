import { useEffect } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { useVisitTracker } from '@/hooks/use-visit-tracker';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    useVisitTracker();

    useEffect(() => {
        document.documentElement.classList.add('app-page');
        document.documentElement.classList.remove('dark', 'marketing-page');
        document.documentElement.style.colorScheme = 'light';

        return () => {
            document.documentElement.classList.remove('app-page');
            document.documentElement.style.colorScheme = '';
        };
    }, []);

    return (
        <div className="app-site">
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent
                    variant="sidebar"
                    className="overflow-x-hidden bg-background"
                >
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <div className="flex flex-1 flex-col">{children}</div>
                </AppContent>
            </AppShell>
        </div>
    );
}
