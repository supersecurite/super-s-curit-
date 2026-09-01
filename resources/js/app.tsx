import { createInertiaApp } from '@inertiajs/react';
import { AppChrome } from '@/components/app-chrome';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import MarketingLayout from '@/layouts/marketing-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { AppLayoutProps } from '@/types/ui';

const appName = import.meta.env.VITE_APP_NAME || 'SUPER_SECURITE';

function SettingsAppLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>{children}</SettingsLayout>
        </AppLayout>
    );
}

function initialPageComponent(): string {
    const pageData = document.querySelector<HTMLScriptElement>(
        'script[data-page="app"]',
    )?.textContent;

    if (!pageData) {
        return '';
    }

    try {
        return (JSON.parse(pageData) as { component?: string }).component ?? '';
    } catch {
        return '';
    }
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('marketing/'):
            case name.startsWith('errors/'):
                return MarketingLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return SettingsAppLayout;
            default:
                return AppLayout;
        }
    },
    withApp(app) {
        const page = initialPageComponent();

        if (page.startsWith('marketing/') || page.startsWith('errors/')) {
            return app;
        }

        return <AppChrome>{app}</AppChrome>;
    },
    progress: false,
});
