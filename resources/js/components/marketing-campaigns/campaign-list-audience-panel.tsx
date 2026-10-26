import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { Link } from '@inertiajs/react';
import { AlertCircle, Loader2, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import { show as marketingListShow } from '@/routes/marketing-lists';

export type ListAudienceContact = {
    uuid: string;
    full_name: string;
    email: string | null;
    marketing_consent: boolean;
    is_eligible: boolean;
};

export type ListAudiencePayload = {
    list: {
        uuid: string;
        name: string;
        contacts_count: number;
    };
    contacts: ListAudienceContact[];
    stats: {
        total: number;
        eligible: number;
        ineligible: number;
    };
};

type CampaignListAudiencePanelProps = {
    audience: ListAudiencePayload | null;
    loading: boolean;
    error: string | null;
};

const PREVIEW_LIMIT = 12;

export default function CampaignListAudiencePanel({
    audience,
    loading,
    error,
}: CampaignListAudiencePanelProps) {
    const { t: uiText } = useUiTranslations();

    const getInitials = useInitials();

    if (loading) {
        return (
            <section className="app-panel space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="size-4" aria-hidden />
                    {uiText('ui.components.text_545c02357695', 'Audience')}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {uiText(
                        'ui.components.text_46f26080a8d2',
                        'Chargement des contacts…',
                    )}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="app-panel space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="size-4" aria-hidden />
                    {uiText('ui.components.text_545c02357695', 'Audience')}
                </div>
                <p className="text-sm text-destructive">{error}</p>
            </section>
        );
    }

    if (audience === null) {
        return null;
    }

    const previewContacts = audience.contacts.slice(0, PREVIEW_LIMIT);
    const hiddenCount = Math.max(audience.contacts.length - PREVIEW_LIMIT, 0);

    return (
        <section className="app-panel space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Users className="size-4" aria-hidden />
                        {uiText('ui.components.text_545c02357695', 'Audience')}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {audience.list.name}
                    </p>
                </div>
                <Link
                    href={marketingListShow.url(audience.list.uuid)}
                    className="text-xs text-primary hover:underline"
                >
                    {uiText(
                        'ui.components.text_f27187960864',
                        'Voir le groupe',
                    )}
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                    {audience.stats.total}{' '}
                    {uiText('ui.components.text_c1b8683c98ee', 'contact(s)')}
                </Badge>
                <Badge variant="default">
                    {audience.stats.eligible}{' '}
                    {uiText('ui.components.text_2f6e81299780', 'éligible(s)')}
                </Badge>
                {audience.stats.ineligible > 0 ? (
                    <Badge variant="outline">
                        {audience.stats.ineligible}{' '}
                        {uiText('ui.components.text_e9d8e46b7556', 'exclus')}
                    </Badge>
                ) : null}
            </div>

            {audience.stats.ineligible > 0 ? (
                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertCircle
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden
                    />
                    {uiText(
                        'ui.components.text_5d43f0044a14',
                        'Seuls les contacts avec consentement marketing et une adresse e-mail recevront la campagne.',
                    )}
                </p>
            ) : null}

            {audience.contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    {uiText(
                        'ui.components.text_55eb2f1c0ac8',
                        'Ce groupe ne contient aucun contact.',
                    )}
                </p>
            ) : (
                <ul className="space-y-2">
                    {previewContacts.map((contact) => (
                        <li
                            key={contact.uuid}
                            className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2"
                        >
                            <Avatar className="size-9 shrink-0">
                                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                                    {getInitials(
                                        contact.full_name !== '—'
                                            ? contact.full_name
                                            : '?',
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {contact.full_name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {contact.email ?? 'Sans e-mail'}
                                </p>
                            </div>
                            {!contact.is_eligible ? (
                                <Badge
                                    variant="outline"
                                    className="shrink-0 text-[10px]"
                                >
                                    {uiText(
                                        'ui.components.text_68e7e51609e9',
                                        'Exclu',
                                    )}
                                </Badge>
                            ) : null}
                        </li>
                    ))}
                </ul>
            )}

            {hiddenCount > 0 ? (
                <p className="text-center text-xs text-muted-foreground">
                    + {hiddenCount}{' '}
                    {uiText('ui.components.text_e996f291499e', 'autre')}{' '}
                    {hiddenCount > 1 ? 's' : ''}{' '}
                    {uiText('ui.components.text_093e7d5fdbaa', 'contact')}{' '}
                    {hiddenCount > 1 ? 's' : ''}
                </p>
            ) : null}
        </section>
    );
}
