import type { MarketingPageHeroUnderline } from '@/data/marketing-page-heroes';
import { cn } from '@/lib/utils';

type HeroTitleUnderlineProps = {
    variant: MarketingPageHeroUnderline;
    gradientId: string;
};

function UnderlineGradient({ id }: { id: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--super-securite-accent)" />
                <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
        </defs>
    );
}

export default function HeroTitleUnderline({
    variant,
    gradientId,
}: HeroTitleUnderlineProps) {
    const svgClassName =
        'absolute -bottom-3 left-0 w-full sm:-bottom-4';

    if (variant === 'slide') {
        return (
            <span
                className={cn(
                    'marketing-underline-slide absolute -bottom-2 left-0 block h-1 w-full rounded-full sm:-bottom-3',
                )}
                aria-hidden
            />
        );
    }

    if (variant === 'grow') {
        return (
            <svg
                viewBox="0 0 380 22"
                className={cn(svgClassName, 'marketing-underline-grow')}
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
            >
                <path
                    d="M2 16 C 100 1, 280 1, 378 16"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <UnderlineGradient id={gradientId} />
            </svg>
        );
    }

    if (variant === 'double') {
        return (
            <svg
                viewBox="0 0 380 22"
                className={cn(svgClassName, 'marketing-underline-double')}
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
            >
                <path
                    d="M2 10 C 100 2, 280 2, 378 10"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M2 18 C 100 12, 280 12, 378 18"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeOpacity="0.55"
                />
                <UnderlineGradient id={gradientId} />
            </svg>
        );
    }

    if (variant === 'scan') {
        return (
            <svg
                viewBox="0 0 380 22"
                className={cn(svgClassName, 'marketing-underline-scan')}
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
            >
                <path
                    d="M2 14 H378"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <UnderlineGradient id={gradientId} />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 380 22"
            className={cn(svgClassName, 'marketing-underline-draw')}
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
        >
            <path
                d="M2 16 C 100 1, 280 1, 378 16"
                stroke={`url(#${gradientId})`}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <UnderlineGradient id={gradientId} />
        </svg>
    );
}
