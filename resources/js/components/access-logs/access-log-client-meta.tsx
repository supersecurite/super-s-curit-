import CountryFlag from '@/components/analytics/country-flag';

type AccessLogClientMetaProps = {
    country_code?: string | null;
    country?: string | null;
    browser_label?: string | null;
    ip?: string | null;
    compact?: boolean;
};

/**
 * Drapeau pays + navigateur pour une entrée du journal d'accès.
 */
export function AccessLogClientMeta({
    country_code,
    country,
    browser_label,
    ip,
    compact = false,
}: AccessLogClientMetaProps) {
    return (
        <div
            className={
                compact
                    ? 'flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground'
                    : 'flex flex-col gap-1 text-sm'
            }
        >
            <div className="flex items-center gap-2">
                {country_code ? (
                    <CountryFlag
                        code={country_code}
                        className="h-4 w-6 shrink-0"
                    />
                ) : (
                    <span
                        className="inline-flex h-4 w-6 items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground"
                        aria-hidden
                    >
                        ?
                    </span>
                )}
                <span className={compact ? '' : 'font-medium'}>
                    {country ?? 'Pays inconnu'}
                </span>
                {!compact && ip ? (
                    <span className="text-muted-foreground text-xs">{ip}</span>
                ) : null}
            </div>
            {browser_label ? (
                <span className={compact ? '' : 'text-muted-foreground text-xs'}>
                    {compact ? `· ${browser_label}` : browser_label}
                </span>
            ) : null}
            {compact && ip ? (
                <>
                    <span aria-hidden>·</span>
                    <span>{ip}</span>
                </>
            ) : null}
        </div>
    );
}
