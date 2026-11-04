import type { CSSProperties, ReactNode } from 'react';
import { Loader2, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
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
    /** Si false, l'overlay n'intercepte pas les clics (navigations courtes). */
    blocking?: boolean;
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
                className="loader-logo-ring absolute inset-0 rounded-full border-2 border-white/25"
                aria-hidden
            />
            <span
                className="loader-logo-ring-delayed absolute inset-2 rounded-full border border-white/40"
                aria-hidden
            />
            <span
                className="loader-logo-glow absolute inset-4 rounded-full bg-[var(--super-securite-accent)]/25 blur-xl"
                aria-hidden
            />
            <div className="loader-logo-mark relative z-10 overflow-hidden rounded-xl drop-shadow-lg">
                <img
                    src="/icon-transparent.png"
                    alt="Super Sécurité"
                    width={size}
                    height={size}
                    className="size-full object-cover"
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
    const style: CSSProperties = { width: size, height: size };

    switch (type) {
        case 'logo':
            return <AnimatedAppLogo size={size} />;

        case 'default':
            return (
                <Spinner
                    className={cn('text-white', className)}
                    style={style}
                />
            );

        default:
            return (
                <Loader2
                    className={cn('animate-spin text-white', className)}
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
    blocking = true,
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
                blocking ? 'pointer-events-auto' : 'pointer-events-none',
                overlayClassName || 'bg-black/55',
                className,
            )}
            style={{ zIndex }}
            aria-busy="true"
            aria-live="polite"
            role={blocking ? 'alertdialog' : 'status'}
            aria-modal={blocking || undefined}
            aria-label={message}
        >
            <div className="pointer-events-auto flex max-w-sm flex-col items-center gap-5 px-6 text-center">
                {renderSpinner(spinnerType, spinnerSize)}
                {message && (
                    <p className="text-lg font-medium text-white">{message}</p>
                )}
                {subtitle && (
                    <p className="text-sm text-white/70">{subtitle}</p>
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
                                className="cursor-pointer gap-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
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
