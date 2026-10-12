import { useTrans } from '@/hooks/use-trans';

type CmsLocaleNoticeProps = {
    /** When false, hide even under /en (e.g. article already translated). */
    show?: boolean;
};

/**
 * Bandeau : contenu CMS encore en français sous les URLs /en.
 */
export default function CmsLocaleNotice({ show = true }: CmsLocaleNoticeProps) {
    const { t, locale } = useTrans();

    if (locale !== 'en' || ! show) {
        return null;
    }

    return (
        <div
            className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
            role="status"
        >
            {t('cms.french_content_notice')}
        </div>
    );
}
