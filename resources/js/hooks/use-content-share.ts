import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
    Check,
    Copy,
    Facebook,
    Linkedin,
    Mail,
    MessageCircle,
    Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    buildEmailShareUrl,
    buildFacebookShareUrl,
    buildLinkedInShareUrl,
    buildWhatsAppShareUrl,
    buildXShareUrl,
    toAbsoluteShareUrl,
} from '@/lib/share-url';

export type ContentShareAction = {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
    external?: boolean;
    onClick?: () => void | Promise<void>;
};

export function useContentShare(
    title: string,
    url: string,
    description?: string | null,
) {
    const [copied, setCopied] = useState(false);
    const absoluteUrl = useMemo(() => toAbsoluteShareUrl(url), [url]);
    const canNativeShare =
        typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    const copyLink = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            toast.success('Lien copié dans le presse-papiers');
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Impossible de copier le lien');
        }
    };

    const nativeShare = async (): Promise<void> => {
        try {
            await navigator.share({
                title,
                text: description ?? title,
                url: absoluteUrl,
            });
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }

            toast.error('Le partage a échoué');
        }
    };

    const actions: ContentShareAction[] = [
        {
            id: 'copy',
            label: copied ? 'Copié' : 'Copier le lien',
            href: '#',
            icon: copied ? Check : Copy,
            onClick: copyLink,
        },
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            href: buildWhatsAppShareUrl(absoluteUrl, title),
            icon: MessageCircle,
            external: true,
        },
        {
            id: 'facebook',
            label: 'Facebook',
            href: buildFacebookShareUrl(absoluteUrl),
            icon: Facebook,
            external: true,
        },
        {
            id: 'linkedin',
            label: 'LinkedIn',
            href: buildLinkedInShareUrl(absoluteUrl),
            icon: Linkedin,
            external: true,
        },
        {
            id: 'x',
            label: 'X',
            href: buildXShareUrl(absoluteUrl, title),
            icon: Share2,
            external: true,
        },
        {
            id: 'email',
            label: 'E-mail',
            href: buildEmailShareUrl(absoluteUrl, title, description ?? undefined),
            icon: Mail,
            external: true,
        },
    ];

    return {
        absoluteUrl,
        actions,
        canNativeShare,
        nativeShare,
    };
}
