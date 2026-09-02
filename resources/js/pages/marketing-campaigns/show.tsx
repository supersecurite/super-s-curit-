import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, Megaphone, Pencil, Radio, Send } from 'lucide-react';
import { useCallback, useState } from 'react';
import {
    BackofficeIndexPanel,
    IndexTablePagination,
    ResponsiveDataTable,
    type ResponsiveColumn,
} from '@/components/backoffice/responsive-data-table';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
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
import { destroy, edit, index, launch, show } from '@/routes/marketing-campaigns';

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
    launched_at_formatted: string | null;
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
    const { campaign, sends, canUpdate, canDelete, canSend, broadcasting } =
        usePage<PageProps>().props;
    const [launching, setLaunching] = useState(false);
    const [liveCampaign, setLiveCampaign] = useState(campaign);
    const [liveSends, setLiveSends] = useState(sends);
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

    const statCards = [
        { label: 'Total', value: liveCampaign.stats.total },
        { label: 'En file', value: liveCampaign.stats.queued },
        {
            label: isWhatsApp ? 'Reçus (delivered)' : 'Reçus',
            value: liveCampaign.stats.received,
        },
        {
            label: isWhatsApp ? 'Lus (read)' : 'Lus / ouverts',
            value: liveCampaign.stats.read,
        },
        { label: 'Échecs', value: liveCampaign.stats.failed + liveCampaign.stats.bounced },
    ];

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

                {liveCampaign.stats.total > 0 ? (
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
                                <dt className="text-muted-foreground">Canal</dt>
                                <dd>{campaign.channel_label}</dd>
                            </div>
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
                        <div className="flex flex-wrap items-end justify-between gap-2">
                            <h2 className="font-semibold">Destinataires</h2>
                            {isWhatsApp ? (
                                <p className="text-muted-foreground text-xs">
                                    Accusés WhatsApp : ✓ envoyé · ✓✓ reçu (delivered) · ✓✓ vert lu
                                    (read)
                                </p>
                            ) : null}
                        </div>
                        <BackofficeIndexPanel>
                            <ResponsiveDataTable<SendRow>
                                rows={liveSends.data}
                                columns={sendColumns}
                                getRowKey={(send) => send.uuid}
                                emptyMessage="Aucun envoi enregistré."
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
