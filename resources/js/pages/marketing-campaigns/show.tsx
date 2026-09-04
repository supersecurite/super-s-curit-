import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, Megaphone, Pencil, Radio, RotateCcw } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import {
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
import CampaignLaunchDialog from '@/components/marketing-campaigns/campaign-launch-dialog';
import CampaignStatsPanel from '@/components/marketing-campaigns/campaign-stats-panel';
import {
    MarketingSendReceiptIndicator,
    marketingSendReceiptAriaLabel,
} from '@/components/marketing-campaigns/marketing-send-receipt-indicator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { withIndexTableQuery } from '@/lib/index-table-query';
import { isBroadcastingConfigured } from '@/lib/echo';
import {
    useMarketingCampaignRealtime,
    type CampaignProgressPayload,
} from '@/hooks/use-marketing-campaign-realtime';
import { destroy, edit, index, retry, show } from '@/routes/marketing-campaigns';

type CampaignStats = {
    total: number;
    queued: number;
    sent: number;
    received: number;
    read: number;
    failed: number;
    bounced: number;
};

type CampaignData = {
    uuid: string;
    name: string;
    channel: string;
    channel_label: string;
    status: string;
    status_label: string;
    subject: string | null;
    body: string;
    list: { uuid: string; name: string } | null;
    lists: { uuid: string; name: string }[];
    audience_contacts: {
        uuid: string;
        full_name: string;
        email: string | null;
        phone: string | null;
    }[];
    template: {
        uuid: string;
        name: string;
        meta_template_name?: string | null;
        meta_template_language?: string | null;
    } | null;
    email_account: {
        uuid: string;
        name: string;
        from_address: string;
        daily_send_limit: number | null;
        remaining_today: number | null;
    } | null;
    launched_at_formatted: string | null;
    scheduled_at_formatted: string | null;
    completed_at_formatted: string | null;
    created_at_formatted: string | null;
    stats: CampaignStats;
};

type SendRow = {
    uuid: string;
    recipient_email: string | null;
    recipient_phone: string | null;
    recipient_name: string | null;
    status: string;
    status_label: string;
    sent_at_formatted: string | null;
    received_at_formatted: string | null;
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
    canRetry: boolean;
    broadcasting: {
        enabled: boolean;
    };
};

function statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    switch (status) {
        case 'received':
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
        case 'scheduled':
            return 'secondary';
        default:
            return 'outline';
    }
}

/** Adresse réellement utilisée pour l’envoi (téléphone WhatsApp ou e-mail). */
function sendDestination(
    send: Pick<SendRow, 'recipient_email' | 'recipient_phone'>,
    channel: string,
): { value: string; label: string } {
    if (channel === 'whatsapp') {
        return {
            value: send.recipient_phone || send.recipient_email || '—',
            label: send.recipient_phone ? 'WhatsApp' : 'E-mail',
        };
    }

    return {
        value: send.recipient_email || send.recipient_phone || '—',
        label: send.recipient_email ? 'E-mail' : 'WhatsApp',
    };
}

export default function MarketingCampaignsShow() {
    const { campaign, sends, canUpdate, canDelete, canSend, canRetry, broadcasting } =
        usePage<PageProps>().props;
    const [liveCampaign, setLiveCampaign] = useState(campaign);
    const [liveSends, setLiveSends] = useState(sends);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [retrying, setRetrying] = useState(false);
    const isWhatsApp = campaign.channel === 'whatsapp';
    const listHref = index.url({ query: { channel: campaign.channel } });

    const realtimeEnabled =
        broadcasting.enabled &&
        isBroadcastingConfigured() &&
        ['sending', 'queued'].includes(liveCampaign.status);

    const handleProgress = useCallback((payload: CampaignProgressPayload) => {
        setLiveCampaign((previous) => ({
            ...previous,
            ...payload.campaign,
            stats: payload.campaign.stats,
        }));

        if (payload.send === null) {
            return;
        }

        const send = payload.send;

        setLiveSends((previous) => ({
            ...previous,
            data: previous.data.some((row) => row.uuid === send.uuid)
                ? previous.data.map((row) =>
                      row.uuid === send.uuid
                          ? {
                                ...row,
                                ...send,
                                recipient_email:
                                    send.recipient_email ?? row.recipient_email,
                                recipient_phone:
                                    send.recipient_phone ?? row.recipient_phone,
                            }
                          : row,
                  )
                : [
                      {
                          ...send,
                          recipient_email: send.recipient_email ?? null,
                          recipient_phone: send.recipient_phone ?? null,
                      },
                      ...previous.data,
                  ],
        }));
    }, []);

    useMarketingCampaignRealtime(campaign.uuid, realtimeEnabled, handleProgress);

    setLayoutProps({
        breadcrumbs: [
            {
                title: isWhatsApp ? 'Campagnes WhatsApp' : 'Campagnes e-mail',
                href: listHref,
            },
            { title: campaign.name, href: show.url(campaign.uuid) },
        ],
    });

    const buildPageUrl = (page: number) =>
        show.url(campaign.uuid, { query: withIndexTableQuery({}, page) });

    const handleRetry = () => {
        setRetrying(true);
        router.post(
            retry.url(campaign.uuid),
            {},
            {
                preserveScroll: true,
                onFinish: () => setRetrying(false),
            },
        );
    };

    const sendColumns: ResponsiveColumn<SendRow>[] = [
        {
            id: 'recipient',
            header: 'Destinataire',
            mobileRole: 'title',
            cell: (send) => {
                const destination = sendDestination(send, campaign.channel);

                return (
                    <div>
                        <p className="font-medium">
                            {send.recipient_name ?? destination.value}
                        </p>
                        <p className="text-muted-foreground text-xs">
                            {destination.label} : {destination.value}
                        </p>
                    </div>
                );
            },
        },
        {
            id: 'status',
            header: 'Statut',
            cell: (send) => (
                <div
                    className="flex items-center gap-2"
                    aria-label={marketingSendReceiptAriaLabel(send.status, campaign.channel)}
                >
                    <MarketingSendReceiptIndicator
                        status={send.status}
                        channel={campaign.channel}
                    />
                    <Badge variant={statusVariant(send.status)}>{send.status_label}</Badge>
                </div>
            ),
        },
        {
            id: 'sent_at',
            header: 'Envoyé',
            cell: (send) => send.sent_at_formatted ?? '—',
        },
        {
            id: 'received_at',
            header: campaign.channel === 'whatsapp' ? 'Reçu (delivered)' : 'Reçu',
            cell: (send) =>
                send.received_at_formatted ?? send.delivered_at_formatted ?? '—',
        },
        {
            id: 'read_at',
            header: campaign.channel === 'whatsapp' ? 'Lu (read)' : 'Lu',
            cell: (send) => send.read_at_formatted ?? '—',
        },
        {
            id: 'failure',
            header: 'Erreur',
            cell: (send) => send.failure_reason ?? '—',
        },
    ];

    const filteredSendsData = useMemo(() => {
        if (!statusFilter) {
            return liveSends.data;
        }

        if (statusFilter === 'failed') {
            return liveSends.data.filter(
                (row) => row.status === 'failed' || row.status === 'bounced',
            );
        }

        return liveSends.data.filter((row) => row.status === statusFilter);
    }, [liveSends.data, statusFilter]);

    return (
        <>
            <Head title={campaign.name} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Link
                            href={listHref}
                            className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                        >
                            <ArrowLeft className="size-4" aria-hidden />
                            Retour aux campagnes {isWhatsApp ? 'WhatsApp' : 'e-mail'}
                        </Link>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <Megaphone className="size-6" aria-hidden />
                            {campaign.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant={statusVariant(liveCampaign.status)}>
                                {liveCampaign.status_label}
                            </Badge>
                            <Badge variant="outline">{campaign.channel_label}</Badge>
                            {realtimeEnabled ? (
                                <Badge variant="outline" className="gap-1">
                                    <Radio className="size-3 animate-pulse" aria-hidden />
                                    Temps réel
                                </Badge>
                            ) : null}
                            {(liveCampaign.lists ?? []).map((list) => (
                                <Badge key={list.uuid} variant="outline">
                                    Groupe : {list.name}
                                </Badge>
                            ))}
                            {(liveCampaign.audience_contacts?.length ?? 0) > 0 ? (
                                <Badge variant="outline">
                                    {liveCampaign.audience_contacts.length} contact
                                    {liveCampaign.audience_contacts.length > 1 ? 's' : ''} direct
                                    {liveCampaign.audience_contacts.length > 1 ? 's' : ''}
                                </Badge>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {canRetry ? (
                            <Button
                                variant="outline"
                                onClick={handleRetry}
                                disabled={retrying}
                            >
                                <RotateCcw
                                    className={`size-4 ${retrying ? 'animate-spin' : ''}`}
                                    aria-hidden
                                />
                                {retrying ? 'Relance en cours...' : 'Relancer les échecs'}
                            </Button>
                        ) : null}
                        {canSend ? (
                            <CampaignLaunchDialog
                                campaignUuid={campaign.uuid}
                                campaignName={campaign.name}
                                scheduledAtFormatted={liveCampaign.scheduled_at_formatted}
                            />
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

                {liveCampaign.stats.total > 0 ? (
                    <CampaignStatsPanel
                        stats={liveCampaign.stats}
                        channel={campaign.channel}
                        selectedStatusFilter={statusFilter}
                        onSelectStatusFilter={setStatusFilter}
                    />
                ) : null}

                <div className="grid gap-4 lg:grid-cols-2">
                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">Message</h2>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Canal</dt>
                                <dd>{campaign.channel_label}</dd>
                            </div>
                            {campaign.channel === 'email' && campaign.email_account ? (
                                <div>
                                    <dt className="text-muted-foreground">Compte e-mail</dt>
                                    <dd>
                                        {campaign.email_account.name} (
                                        {campaign.email_account.from_address})
                                        {campaign.email_account.daily_send_limit !== null
                                            ? ` — quota ${campaign.email_account.remaining_today ?? 0}/${campaign.email_account.daily_send_limit}`
                                            : ''}
                                    </dd>
                                </div>
                            ) : null}
                            {campaign.channel === 'email' ? (
                                <div>
                                    <dt className="text-muted-foreground">Objet</dt>
                                    <dd>{campaign.subject ?? '—'}</dd>
                                </div>
                            ) : null}
                            {campaign.template ? (
                                <div>
                                    <dt className="text-muted-foreground">Template source</dt>
                                    <dd>{campaign.template.name}</dd>
                                </div>
                            ) : null}
                            {campaign.channel === 'whatsapp' && campaign.template ? (
                                <>
                                    <div>
                                        <dt className="text-muted-foreground">Modèle Meta</dt>
                                        <dd className="font-mono text-xs">
                                            {campaign.template.meta_template_name ?? '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground">Langue Meta</dt>
                                        <dd className="font-mono text-xs">
                                            {campaign.template.meta_template_language ?? '—'}
                                        </dd>
                                    </div>
                                </>
                            ) : null}
                        </dl>
                    </section>

                    <section className="app-panel space-y-4 p-4">
                        <h2 className="font-semibold">Audience & historique</h2>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Groupes</dt>
                                <dd>
                                    {(campaign.lists ?? []).length > 0
                                        ? campaign.lists.map((list) => list.name).join(', ')
                                        : '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Contacts directs</dt>
                                <dd>
                                    {(campaign.audience_contacts ?? []).length > 0
                                        ? campaign.audience_contacts
                                              .map((contact) => contact.full_name)
                                              .join(', ')
                                        : '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Créée le</dt>
                                <dd>{campaign.created_at_formatted ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Planifiée pour</dt>
                                <dd>{liveCampaign.scheduled_at_formatted ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Lancée le</dt>
                                <dd>{liveCampaign.launched_at_formatted ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Terminée le</dt>
                                <dd>{liveCampaign.completed_at_formatted ?? '—'}</dd>
                            </div>
                        </dl>
                    </section>

                    {campaign.channel === 'email' ? (
                        <section className="app-panel space-y-4 p-4 lg:col-span-2">
                            <h2 className="font-semibold">Contenu</h2>
                            <ContentRenderer content={campaign.body} />
                        </section>
                    ) : (
                        <section className="app-panel space-y-2 p-4 lg:col-span-2">
                            <h2 className="font-semibold">Contenu</h2>
                            <p className="text-muted-foreground text-sm">
                                Message envoyé via le modèle Meta approuvé
                                {campaign.template?.meta_template_name
                                    ? ` « ${campaign.template.meta_template_name} »`
                                    : ''}
                                . Aucun corps libre n&apos;est utilisé pour WhatsApp.
                            </p>
                        </section>
                    )}
                </div>

                {liveCampaign.stats.total > 0 ? (
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <h2 className="font-semibold">Destinataires ({filteredSendsData.length})</h2>
                                {statusFilter ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setStatusFilter(null)}
                                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Effacer le filtre ({statusFilter})
                                    </Button>
                                ) : null}
                            </div>
                            {isWhatsApp ? (
                                <p className="text-muted-foreground text-xs">
                                    Accusés WhatsApp : envoyé (1 coche) · reçu / delivered (2 coches grises) · lu / read (2 coches vertes)
                                </p>
                            ) : null}
                        </div>
                        <BackofficeIndexPanel>
                            <ResponsiveDataTable<SendRow>
                                rows={filteredSendsData}
                                columns={sendColumns}
                                getRowKey={(send) => send.uuid}
                                emptyMessage={statusFilter ? `Aucun destinataire avec le statut « ${statusFilter} » sur cette page.` : "Aucun envoi enregistré."}
                            />
                            <IndexTablePagination
                                paginated={liveSends}
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
        { title: 'Campagnes', href: index.url() },
        { title: 'Détail', href: show.url('') },
    ],
};
