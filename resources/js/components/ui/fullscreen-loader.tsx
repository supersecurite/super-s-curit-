import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner, type SpinnerProps } from '@/components/ui/spinner';
import { LumaSpin } from '@/components/ui/luma-spin';
import SnowBallLoadingSpinner from '@/components/ui/snow-ball-loading-spinner';

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
    | 'snow-ball';

interface FullscreenLoaderProps {
    /**
     * Affiche le loader si true
     */
    isLoading: boolean;

    /**
     * Type de spinner à afficher
     * @default 'loader2'
     */
    spinnerType?: SpinnerType;

    /**
     * Taille du spinner (pour les spinners qui le supportent)
     * @default 64
     */
    spinnerSize?: number;

    /**
     * Message principal affiché sous le spinner
     */
    message?: string;

    /**
     * Message secondaire affiché sous le message principal
     */
    subtitle?: string;

    /**
     * Classe CSS personnalisée pour le conteneur
     */
    className?: string;

    /**
     * Classe CSS personnalisée pour le fond
     */
    overlayClassName?: string;

    /**
     * z-index du loader (par défaut 10000)
     */
    zIndex?: number;
}

/**
 * Rendu du spinner selon le type sélectionné
 */
function renderSpinner(
    type: SpinnerType,
    size: number,
    className?: string
): React.ReactNode {
    const spinnerProps: Partial<SpinnerProps> = {
        size,
        className: cn('text-[color:var(--accent-500)]', className),
    };

    switch (type) {
        case 'loader2':
            return (
                <Loader2
                    className={cn(
                        'animate-spin text-[color:var(--primary-500)]',
                        className
                    )}
                    size={size}
                />
            );

        case 'luma-spin':
            return <LumaSpin />;

        case 'snow-ball':
            return <SnowBallLoadingSpinner />;

        case 'default':
        case 'circle':
        case 'pinwheel':
        case 'circle-filled':
        case 'ellipsis':
        case 'ring':
        case 'bars':
        case 'infinite':
            return <Spinner variant={type} {...spinnerProps} />;

        default:
            return (
                <Loader2
                    className={cn(
                        'animate-spin text-[color:var(--primary-500)]',
                        className
                    )}
                    size={size}
                />
            );
    }
}

/**
 * Composant de loader plein écran réutilisable
 */
export function FullscreenLoader({
    isLoading,
    spinnerType = 'loader2',
    spinnerSize = 64,
    message,
    subtitle,
    className,
    overlayClassName,
    zIndex = 10000,
}: FullscreenLoaderProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy={isLoading}
            aria-hidden={!isLoading}
            className={cn(
                'fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-opacity duration-200',
                overlayClassName || 'bg-[color:var(--primary-500)]/5',
                isLoading
                    ? 'pointer-events-auto opacity-100'
                    : 'pointer-events-none opacity-0',
                className,
            )}
            style={{ zIndex: isLoading ? zIndex : -1 }}
        >
            <div
                className={cn(
                    'flex flex-col items-center gap-4 transition-opacity duration-200',
                    isLoading ? 'opacity-100' : 'opacity-0',
                )}
            >
                {renderSpinner(spinnerType, spinnerSize)}
                {message && (
                    <p className="text-lg font-medium text-foreground">
                        {message}
                    </p>
                )}
                {subtitle && (
                    <p className="text-sm text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
