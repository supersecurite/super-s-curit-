import { Check, CheckCheck, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type MarketingSendReceiptIndicatorProps = {
    status: string;
    className?: string;
};

/**
 * Indicateur type WhatsApp pour le suivi d'un envoi e-mail :
 * 1 ✓ = envoyé, 2 ✓ gris = reçu (non lu), 2 ✓ vert = lu.
 */
export function MarketingSendReceiptIndicator({
    status,
    className,
}: MarketingSendReceiptIndicatorProps) {
    if (status === 'read') {
        return (
            <CheckCheck
                className={cn('size-4 shrink-0 text-emerald-500', className)}
                aria-hidden
            />
        );
    }

    if (status === 'received' || status === 'delivered') {
        return (
            <CheckCheck
                className={cn('size-4 shrink-0 text-muted-foreground', className)}
                aria-hidden
            />
        );
    }

    if (status === 'sent') {
        return (
            <Check
                className={cn('size-4 shrink-0 text-muted-foreground', className)}
                aria-hidden
            />
        );
    }

    if (status === 'queued') {
        return (
            <Clock
                className={cn('size-4 shrink-0 text-muted-foreground', className)}
                aria-hidden
            />
        );
    }

    if (status === 'failed' || status === 'bounced') {
        return (
            <X
                className={cn('size-4 shrink-0 text-destructive', className)}
                aria-hidden
            />
        );
    }

    return null;
}

export function marketingSendReceiptAriaLabel(status: string): string {
    switch (status) {
        case 'read':
            return 'Lu';
        case 'received':
        case 'delivered':
            return 'Reçu, non lu';
        case 'sent':
            return 'Envoyé';
        case 'queued':
            return 'En file';
        case 'failed':
        case 'bounced':
            return 'Échec';
        default:
            return 'Statut inconnu';
    }
}
