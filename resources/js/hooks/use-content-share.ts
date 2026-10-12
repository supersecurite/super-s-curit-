import { useCallback, useMemo, useState } from 'react';
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
import { useTrans } from '@/hooks/use-trans';
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
    const { t } = useTrans();
    const [copied, setCopied] = useState(false);
    const absoluteUrl = useMemo(() => toAbsoluteShareUrl(url), [url]);
    const canNativeShare =
        typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    const copyLink = useCallback(async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            toast.success(
                t(
                    'share.link_copied',
                    'Lien copié dans le presse-papiers',
                ),
            );
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error(
                t('share.copy_failed', 'Impossible de copier le lien'),
            );
        }
    }, [absoluteUrl, t]);

    const nativeShare = useCallback(async (): Promise<void> => {
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

            toast.error(t('share.failed', 'Le partage a échoué'));
        }
    }, [absoluteUrl, description, title, t]);

    const actions: ContentShareAction[] = useMemo(
        () => [
            {
                id: 'copy',
                label: copied
                    ? t('share.copied', 'Copié')
                    : t('share.copy_link', 'Copier le lien'),
                href: '#',
                icon: copied ? Check : Copy,
                onClick: copyLink,
            },
            {
                id: 'whatsapp',
                label: t('share.whatsapp', 'WhatsApp'),
                href: buildWhatsAppShareUrl(absoluteUrl, title),
                icon: MessageCircle,
                external: true,
            },
            {
                id: 'facebook',
                label: t('share.facebook', 'Facebook'),
                href: buildFacebookShareUrl(absoluteUrl),
                icon: Facebook,
                external: true,
            },
            {
                id: 'linkedin',
                label: t('share.linkedin', 'LinkedIn'),
                href: buildLinkedInShareUrl(absoluteUrl),
                icon: Linkedin,
                external: true,
            },
            {
                id: 'x',
                label: t('share.x', 'X'),
                href: buildXShareUrl(absoluteUrl, title),
                icon: Share2,
                external: true,
            },
            {
                id: 'email',
                label: t('share.email', 'E-mail'),
                href: buildEmailShareUrl(
                    absoluteUrl,
                    title,
                    description ?? undefined,
                ),
                icon: Mail,
                external: true,
            },
        ],
        [absoluteUrl, copied, copyLink, description, t, title],
    );

    return {
        absoluteUrl,
        actions,
        canNativeShare,
        nativeShare,
    };
}
