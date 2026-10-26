import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router, usePage } from '@inertiajs/react';
import { useTrans } from '@/hooks/use-trans';
import { alternatePath } from '@/lib/locale-url';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
    onSelected?: () => void;
};

/** Drapeaux SVG indépendants de la prise en charge des emoji du navigateur. */
function LanguageFlag({ language }: { language: string }) {
    const base = language.split(/[-_]/)[0];
    if (!['fr', 'en', 'zh'].includes(base)) return null;
    return (
        <svg
            viewBox="0 0 30 20"
            className="h-4 w-6 shrink-0 rounded-[2px] ring-1 ring-black/10"
            aria-hidden="true"
            focusable="false"
        >
            {base === 'fr' ? (
                <>
                    <path fill="#002395" d="M0 0h10v20H0z" />
                    <path fill="#fff" d="M10 0h10v20H10z" />
                    <path fill="#ed2939" d="M20 0h10v20H20z" />
                </>
            ) : base === 'en' ? (
                <>
                    <path fill="#012169" d="M0 0h30v20H0z" />
                    <path
                        stroke="#fff"
                        strokeWidth="4"
                        d="m0 0 30 20M30 0 0 20"
                    />
                    <path
                        stroke="#c8102e"
                        strokeWidth="1.5"
                        d="m0 0 30 20M30 0 0 20"
                    />
                    <path stroke="#fff" strokeWidth="6" d="M15 0v20M0 10h30" />
                    <path
                        stroke="#c8102e"
                        strokeWidth="3.5"
                        d="M15 0v20M0 10h30"
                    />
                </>
            ) : (
                <>
                    <path fill="#de2910" d="M0 0h30v20H0z" />
                    <path
                        fill="#ffde00"
                        d="m5 3 0.7 2.1H8L6.1 6.4l0.7 2.1L5 7.2 3.2 8.5l0.7-2.1L2 5.1h2.3z"
                    />
                    <g fill="#ffde00">
                        <path d="m10 2 .3.9h.9l-.7.5.3.9-.8-.6-.8.6.3-.9-.7-.5h.9z" />
                        <path d="m12 4 .3.9h.9l-.7.5.3.9-.8-.6-.8.6.3-.9-.7-.5h.9z" />
                        <path d="m12 7 .3.9h.9l-.7.5.3.9-.8-.6-.8.6.3-.9-.7-.5h.9z" />
                        <path d="m10 9 .3.9h.9l-.7.5.3.9-.8-.6-.8.6.3-.9-.7-.5h.9z" />
                    </g>
                </>
            )}
        </svg>
    );
}
/** Sélecteur public extensible, avec conservation de la page, des filtres et de l'ancre. */
export default function MarketingLanguageSelect({
    className,
    onSelected,
}: Props) {
    const { t, locale, locales } = useTrans();
    const { localeLabels = {} } = usePage().props as {
        localeLabels?: Record<string, string>;
    };

    if (locales.length < 2) {
        return null;
    }

    const selectLanguage = (target: string) => {
        if (target === locale || !locales.includes(target)) {
            return;
        }

        const targetUrl =
            alternatePath(window.location.pathname, target) +
            window.location.search +
            window.location.hash;
        document.cookie =
            'locale=' + target + ';path=/;max-age=31536000;SameSite=Lax';
        onSelected?.();
        router.visit(targetUrl, { preserveState: false });
    };

    return (
        <Select value={locale} onValueChange={selectLanguage}>
            <SelectTrigger
                aria-label={t('language.label', 'Langue')}
                className={cn(
                    'h-10 max-w-48 cursor-pointer border-super-securite-border bg-white text-super-securite-heading shadow-sm',
                    className,
                )}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {locales.map((language) => (
                    <SelectItem
                        key={language}
                        value={language}
                        textValue={
                            localeLabels[language] ??
                            t('language.' + language, language.toUpperCase())
                        }
                    >
                        <span
                            className="flex items-center gap-2"
                            lang={language}
                        >
                            <LanguageFlag language={language} />
                            <span>
                                {localeLabels[language] ??
                                    t(
                                        'language.' + language,
                                        language.toUpperCase(),
                                    )}
                            </span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
