import { Head, setLayoutProps, usePage } from '@inertiajs/react';
import SecurityTipForm, {
    type SecurityTipFormData,
    type StatusOption,
} from '@/components/conseils/security-tip-form';
import ContentShareLinks from '@/components/content-share-links';
import { useTrans } from '@/hooks/use-trans';
import { edit, index, update } from '@/routes/conseils';

type PageProps = {
    securityTip: SecurityTipFormData & { id: number };
    statusOptions: StatusOption[];
    canApprove: boolean;
    canFeature: boolean;
    publicUrl: string | null;
    errors: Record<string, string>;
};

export default function ConseilsEdit() {
    const { t } = useTrans();
    const { securityTip, statusOptions, canApprove, canFeature, publicUrl, errors } =
        usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: t('tips.title', 'Conseils'), href: index.url() },
            { title: securityTip.title, href: edit.url(securityTip.slug) },
        ],
    });

    return (
        <>
            <Head
                title={`${t('tips.edit', 'Modifier le conseil')} — ${securityTip.title}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('tips.edit', 'Modifier le conseil')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {securityTip.title}
                    </p>
                </div>

                {publicUrl ? (
                    <ContentShareLinks
                        title={securityTip.title}
                        url={publicUrl}
                        description={securityTip.excerpt}
                        variant="app"
                    />
                ) : null}

                <SecurityTipForm
                    securityTip={securityTip}
                    statusOptions={statusOptions}
                    canApprove={canApprove}
                    canFeature={canFeature}
                    submitUrl={update.url(securityTip.slug)}
                    method="put"
                    submitLabel={t('common.save', 'Enregistrer')}
                    cancelHref={index.url()}
                    errors={errors}
                />
            </div>
        </>
    );
}
