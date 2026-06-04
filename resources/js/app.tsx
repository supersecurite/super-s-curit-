import { createInertiaApp } from '@inertiajs/react';
import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import MarketingLayout from '@/layouts/marketing-layout';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'SUPER_SECURITE';

const AuthLayout = lazy(() => import('@/layouts/auth-layout'));
const AppLayout = lazy(() => import('@/layouts/app-layout'));
const SettingsLayout = lazy(() => import('@/layouts/settings/layout'));
const AppChrome = lazy(() =>
    import('@/components/app-chrome').then((module) => ({
        default: module.AppChrome,
    })),
);

function withSuspense<P extends { children: ReactNode }>(
    Layout: ComponentType<P>,
    fallbackClassName = 'min-h-screen',
): ComponentType<P> {
    return function LayoutWithSuspense(props: P) {
        return (
            <Suspense
                fallback={
                    <div className={fallbackClassName}>{props.children}</div>
                }
            >
                <Layout {...props} />
            </Suspense>
        );
    };
}

const SuspendedAuthLayout = withSuspense(AuthLayout);
const SuspendedAppLayout = withSuspense(AppLayout, 'min-h-svh');
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
                return MarketingLayout;
            case name.startsWith('auth/'):
                return SuspendedAuthLayout;
            case name.startsWith('settings/'):
                return (page: ReactNode) => (
                    <Suspense
                        fallback={
                            <div className="min-h-svh">{page}</div>
                        }
                    >
                        <AppLayout>
                            <SettingsLayout>{page}</SettingsLayout>
                        </AppLayout>
                    </Suspense>
                );
            default:
                return SuspendedAppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        if (initialPageComponent().startsWith('marketing/')) {
            return app;
        }

        return (
            <Suspense fallback={app}>
                <AppChrome>{app}</AppChrome>
            </Suspense>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
