type CountryFlagProps = {
    code: string;
    className?: string;
};

export default function CountryFlag({ code, className = 'h-4 w-6' }: CountryFlagProps) {
    const normalized = code.trim().toLowerCase();

    if (normalized.length !== 2) {
        return (
            <span
                className={`inline-flex items-center justify-center rounded-sm bg-muted text-[10px] font-medium text-muted-foreground ${className}`}
                aria-hidden
            >
                ?
            </span>
        );
    }

    return (
        <img
            src={`https://flagcdn.com/w40/${normalized}.png`}
            srcSet={`https://flagcdn.com/w80/${normalized}.png 2x`}
            alt=""
            width={24}
            height={16}
            loading="lazy"
            className={`rounded-sm object-cover shadow-sm ${className}`}
        />
    );
}
