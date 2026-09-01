import type { ReactNode } from 'react';
import { Loader2, LogOut, RefreshCw } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { LumaSpin } from '@/components/ui/luma-spin';
import { Spinner } from '@/components/ui/spinner';
import SnowBallLoadingSpinner from '@/components/ui/snow-ball-loading-spinner';
import { cn } from '@/lib/utils';

export type SpinnerType =
    | 'loader2'
    | 'default'
    | 'circle'
    | 'pinwheel'
    | 'circle-filled'
    | 'ellipsis'
    | 'ring'
    | 'bars'
    | 'infinite'
    | 'luma-spin'
    | 'snow-ball'
    | 'logo';

interface FullscreenLoaderProps {
    isLoading: boolean;
    spinnerType?: SpinnerType;
    spinnerSize?: number;
    message?: string;
    subtitle?: string;
    className?: string;
    overlayClassName?: string;
    zIndex?: number;
    onRefresh?: () => void;
    onLeave?: () => void;
    refreshLabel?: string;
    leaveLabel?: string;
}

function AnimatedAppLogo({ size = 88 }: { size?: number }) {
    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size + 88, height: size + 88 }}
        >
            <span
                className="loader-logo-ring absolute inset-0 rounded-full border-2 border-primary/25"
                aria-hidden
            />
            <span
                className="loader-logo-ring-delayed absolute inset-2 rounded-full border border-primary/40"
                aria-hidden
            />
            <span
                className="loader-logo-glow absolute inset-4 rounded-full bg-primary/15 blur-xl"
                aria-hidden
            />
            <div className="loader-logo-mark relative z-10 drop-shadow-lg">
                <AppLogoIcon
                    alt="Super Sécurité"
                    className="rounded"
                    style={{ width: size, height: size }}
                />
            </div>

            <style>{`
                @keyframes loader-logo-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.04); opacity: 0.92; }
                }

                @keyframes loader-logo-ring {
                    0% { transform: scale(0.92); opacity: 0.55; }
                    70% { transform: scale(1.12); opacity: 0; }
                    100% { transform: scale(1.12); opacity: 0; }
                }

                @keyframes loader-logo-glow {
                    0%, 100% { opacity: 0.35; transform: scale(0.95); }
                    50% { opacity: 0.7; transform: scale(1.08); }
                }

                .loader-logo-mark {
                    animation: loader-logo-pulse 1.8s ease-in-out infinite;
                }

                .loader-logo-ring {
                    animation: loader-logo-ring 1.8s ease-out infinite;
                }

                .loader-logo-ring-delayed {
                    animation: loader-logo-ring 1.8s ease-out infinite;
                    animation-delay: 0.55s;
                }

                .loader-logo-glow {
                    animation: loader-logo-glow 1.8s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .loader-logo-mark,
                    .loader-logo-ring,
                    .loader-logo-ring-delayed,
                    .loader-logo-glow {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}

function renderSpinner(
    type: SpinnerType,
    size: number,
    className?: string,
): ReactNode {
    switch (type) {
        case 'logo':
            return <AnimatedAppLogo size={size} />;

        case 'luma-spin':
            return <LumaSpin />;

        case 'snow-ball':
            return <SnowBallLoadingSpinner />;

        case 'default':
            return (
                <Spinner
                    className={cn('text-primary', className)}
                    style={{ width: size, height: size }}
                />
            );

        case 'loader2':
        case 'circle':
        case 'pinwheel':
        case 'circle-filled':
        case 'ellipsis':
        case 'ring':
        case 'bars':
        case 'infinite':
        default:
            return (
                <Loader2
                    className={cn('animate-spin text-primary', className)}
                    size={size}
                />
            );
    }
}

export function FullscreenLoader({
    isLoading,
    spinnerType = 'logo',
    spinnerSize = 88,
    message,
    subtitle,
    className,
    overlayClassName,
    zIndex = 10000,
    onRefresh,
    onLeave,
    refreshLabel = 'Actualiser',
    leaveLabel = 'Quitter',
}: FullscreenLoaderProps) {
    if (!isLoading) {
        return null;
    }

    const showRecovery = Boolean(onRefresh || onLeave);

    return (
        <div
            className={cn(
                'fixed inset-0 flex items-center justify-center backdrop-blur-sm',
                overlayClassName || 'bg-background/60',
                className,
            )}
            style={{ zIndex }}
            aria-busy="true"
            aria-live="polite"
            role="alertdialog"
            aria-modal="true"
            aria-label={message}
        >
            <div className="flex max-w-sm flex-col items-center gap-5 px-6 text-center">
                {renderSpinner(spinnerType, spinnerSize)}
                {message && (
                    <p className="text-lg font-medium text-foreground">
                        {message}
                    </p>
                )}
                {subtitle && (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}

                {showRecovery && (
                    <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                        {onRefresh && (
                            <Button
                                type="button"
                                variant="default"
                                className="cursor-pointer gap-2"
                                onClick={onRefresh}
                            >
                                <RefreshCw className="size-4" />
                                {refreshLabel}
                            </Button>
                        )}
                        {onLeave && (
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer gap-2 bg-background"
                                onClick={onLeave}
                            >
                                <LogOut className="size-4" />
                                {leaveLabel}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
