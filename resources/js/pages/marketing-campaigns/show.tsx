import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, Megaphone, Pencil, Send } from 'lucide-react';
import { useState } from 'react';
import {
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { withIndexTableQuery } from '@/lib/index-table-query';
import { destroy, edit, index, launch, show } from '@/routes/marketing-campaigns';

type CampaignStats = {
    total: number;
    queued: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    bounced: number;
};

type CampaignData = {
    uuid: string;
    name: string;
    status: string;
    status_label: string;
    subject: string;
    body: string;
    list: { uuid: string; name: string } | null;
    template: { uuid: string; name: string } | null;
    launched_at_formatted: string | null;
    completed_at_formatted: string | null;
    created_at_formatted: string | null;
    stats: CampaignStats;
};

type SendRow = {
    uuid: string;
    recipient_email: string;
    recipient_name: string | null;
    status: string;
    status_label: string;
    sent_at_formatted: string | null;
    delivered_at_formatted: string | null;
    read_at_formatted: string | null;
    failed_at_formatted: string | null;
    failure_reason: string | null;
};

type PaginatedSends = {
    data: SendRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    campaign: CampaignData;
    sends: PaginatedSends;
    canUpdate: boolean;
    canDelete: boolean;
    canSend: boolean;
};

function statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    switch (status) {
        case 'delivered':
        case 'read':
        case 'completed':
            return 'default';
        case 'failed':
        case 'bounced':
            return 'destructive';
        case 'queued':
        case 'sent':
        case 'sending':
            return 'secondary';
        default:
            return 'outline';
    }
}

export default function MarketingCampaignsShow() {
    const { campaign, sends, canUpdate, canDelete, canSend } = usePage<PageProps>().props;
    const [launching, setLaunching] = useState(false);

    setLayoutProps({
        breadcrumbs: [
            { title: 'Campagnes e-mail', href: index.url() },
            { title: campaign.name, href: show.url(campaign.uuid) },
        ],
    });

    const handleLaunch = () => {
        setLaunching(true);
        router.post(launch.url(campaign.uuid), {}, {
            onFinish: () => setLaunching(false),
        });
    };

    const buildPageUrl = (page: number) =>
        show.url(campaign.uuid, { query: withIndexTableQuery({}, page) });

    const sendColumns: ResponsiveColumn<SendRow>[] = [
        {
            id: 'recipient',
            header: 'Destinataire',
            cell: (send) => (
                <div>
                    <p className="font-medium">{send.recipient_name ?? send.recipient_email}</p>
                    {send.recipient_name ? (
                        <p className="text-muted-foreground text-xs">{send.recipient_email}</p>
                    ) : null}
                </div>
            ),
        },
        {
            id: 'status',
            header: 'Statut',
            cell: (send) => (
                <Badge variant={statusVariant(send.status)}>{send.status_label}</Badge>
            ),
        },
        {
            id: 'sent_at',
            header: 'Envoyé',
            cell: (send) => send.sent_at_formatted ?? '—',
        },
        {
            id: 'read_at',
            header: 'Ouvert',
            cell: (send) => send.read_at_formatted ?? '—',
        },
        {
            id: 'failure',
            header: 'Erreur',
            cell: (send) => send.failure_reason ?? '—',
        },
    ];

    const statCards = [
        { label: 'Total', value: campaign.stats.total },
        { label: 'En file', value: campaign.stats.queued },
        { label: 'Livrés', value: campaign.stats.delivered },
        { label: 'Ouverts', value: campaign.stats.read },
        { label: 'Échecs', value: campaign.stats.failed + campaign.stats.bounced },
    ];

    return (
        <>
            <Head title={campaign.name} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Link
                            href={index.url()}
                            className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                        >
                            <ArrowLeft className="size-4" aria-hidden />
                            Retour à la liste
                        </Link>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Megaphone className="size-6" aria-hidden />
                            {campaign.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant={statusVariant(campaign.status)}>
                                {campaign.status_label}
                            </Badge>
                            {campaign.list ? (
                                <Badge variant="outline">Liste : {campaign.list.name}</Badge>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {canSend ? (
                            <Button onClick={handleLaunch} disabled={launching}>
                                <Send className="size-4" aria-hidden />
                                {launching ? 'Lancement…' : 'Lancer la campagne'}
                            </Button>
                        ) : null}
                        {canUpdate ? (
                            <Button variant="outline" asChild>
                                <Link href={edit.url(campaign.uuid)}>
                                    <Pencil className="size-4" aria-hidden />
                                    Modifier
                                </Link>
                            </Button>
                        ) : null}
                        {canDelete ? (
                            <ConfirmDeleteDialog
                                title="Supprimer cette campagne ?"
                                description={`La campagne « ${campaign.name} » sera définitivement supprimée.`}
                                deleteUrl={destroy.url(campaign.uuid)}
                                triggerLabel="Supprimer"
                                triggerVariant="outline"
                                triggerClassName="text-destructive hover:text-destructive"
                            />
                        ) : null}
                    </div>
                </div>

                {campaign.stats.total > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {statCards.map((stat) => (
                            <div key={stat.label} className="app-panel p-4">
                                <p className="text-muted-foreground text-xs">{stat.label}</p>
                                <p className="font-heading text-2xl font-semibold">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                ) : null}

                <div className="grid gap-4 lg:grid-cols-2">
                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">Message</h2>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Objet</dt>
                                <dd>{campaign.subject}</dd>
                            </div>
                            {campaign.template ? (
                                <div>
                                    <dt className="text-muted-foreground">Modèle source</dt>
                                    <dd>{campaign.template.name}</dd>
                                </div>
                            ) : null}
                        </dl>
                    </section>

                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">Historique</h2>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Créée le</dt>
                                <dd>{campaign.created_at_formatted ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Lancée le</dt>
                                <dd>{campaign.launched_at_formatted ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Terminée le</dt>
                                <dd>{campaign.completed_at_formatted ?? '—'}</dd>
                            </div>
                        </dl>
                    </section>

                    <section className="app-panel space-y-4 p-4 lg:col-span-2">
                        <h2 className="font-semibold">Contenu</h2>
                        <ContentRenderer content={campaign.body} />
                    </section>
                </div>

                {campaign.stats.total > 0 ? (
                    <div className="space-y-3">
                        <h2 className="font-semibold">Destinataires</h2>
                        <BackofficeIndexPanel>
                            <ResponsiveDataTable<SendRow>
                                rows={sends.data}
                                columns={sendColumns}
                                getRowKey={(send) => send.uuid}
                                emptyMessage="Aucun envoi enregistré."
                            />
                            <IndexTablePagination
                                paginated={sends}
                                itemLabel="envois"
                                buildPageUrl={buildPageUrl}
                            />
                        </BackofficeIndexPanel>
                    </div>
                ) : null}
            </div>
        </>
    );
}

MarketingCampaignsShow.layout = {
    breadcrumbs: [
        { title: 'Campagnes e-mail', href: index.url() },
        { title: 'Détail', href: show.url('') },
    ],
};
