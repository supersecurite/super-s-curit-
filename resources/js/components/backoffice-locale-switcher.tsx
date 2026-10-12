import { router, usePage } from '@inertiajs/react';
import { useTrans } from '@/hooks/use-trans';
import { cn } from '@/lib/utils';

type LocalePageProps = {
    auth?: { user?: unknown };
    locales?: string[];
    localeLabels?: Record<string, string>;
};

/**
 * Switcher FR|EN pour le shell backoffice (session + cookie, hors URL).
 */
export function BackofficeLocaleSwitcher({
    className,
}: {
    className?: string;
}) {
    const { t, locale, locales: hookLocales } = useTrans();
    const {
        auth,
        locales: pageLocales,
        localeLabels = {},
    } = usePage<LocalePageProps>().props;
    const locales = pageLocales?.length ? pageLocales : hookLocales;
    const isAuthenticated = Boolean(auth?.user);

    if (locales.length < 2) {
        return null;
    }

    const switchLocale = (target: string) => {
        if (target === locale) {
            return;
        }

        document.cookie = `backoffice_locale=${target};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;

        if (! isAuthenticated) {
            router.reload();

            return;
        }

        router.put(
            '/backoffice/locale',
            { locale: target },
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-0.5 rounded-md border border-border/70 bg-background/80 p-0.5 text-xs font-medium',
                className,
            )}
            role="group"
            aria-label={t('common.language', 'Langue')}
        >
            {locales.map((loc) => (
                <button
                    key={loc}
                    type="button"
                    onClick={() => switchLocale(loc)}
                    aria-current={loc === locale ? 'true' : undefined}
                    className={cn(
                        'rounded px-2 py-1 uppercase transition-colors',
                        loc === locale
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                >
                    {localeLabels[loc] ?? loc}
                </button>
            ))}
        </div>
    );
}
