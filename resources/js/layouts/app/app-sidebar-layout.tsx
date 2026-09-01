import { useEffect } from 'react';
import { AppContent } from '@/components/app-content';
import { AppPageBreadcrumbs } from '@/components/app-page-breadcrumbs';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
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
        <div className="app-site relative min-h-svh bg-background text-foreground">
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent
                    variant="sidebar"
                    className="flex min-h-0 flex-col overflow-x-hidden"
                >
                    <div
                        className="h-1.5 shrink-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60 md:rounded-t-2xl"
                        aria-hidden
                    />
                    <AppSidebarHeader />
                    <AppPageBreadcrumbs breadcrumbs={breadcrumbs} />
                    <div className="flex flex-1 flex-col">{children}</div>
                </AppContent>
            </AppShell>
        </div>
    );
}
