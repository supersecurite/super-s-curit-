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
    const getInitials = useInitials();

    if (loading) {
        return (
            <section className="app-panel space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="size-4" aria-hidden />
                    Audience
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Chargement des contacts…
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="app-panel space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="size-4" aria-hidden />
                    Audience
                </div>
                <p className="text-destructive text-sm">{error}</p>
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
                        Audience
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">{audience.list.name}</p>
                </div>
                <Link
                    href={marketingListShow.url(audience.list.uuid)}
                    className="text-primary text-xs hover:underline"
                >
                    Voir la liste
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{audience.stats.total} contact(s)</Badge>
                <Badge variant="default">{audience.stats.eligible} éligible(s)</Badge>
                {audience.stats.ineligible > 0 ? (
                    <Badge variant="outline">{audience.stats.ineligible} exclus</Badge>
                ) : null}
            </div>

            {audience.stats.ineligible > 0 ? (
                <p className="text-muted-foreground flex items-start gap-2 text-xs">
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    Seuls les contacts avec consentement marketing et une adresse e-mail recevront la campagne.
                </p>
            ) : null}

            {audience.contacts.length === 0 ? (
                <p className="text-muted-foreground text-sm">Cette liste ne contient aucun contact.</p>
            ) : (
                <ul className="space-y-2">
                    {previewContacts.map((contact) => (
                        <li
                            key={contact.uuid}
                            className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2"
                        >
                            <Avatar className="size-9 shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                    {getInitials(contact.full_name !== '—' ? contact.full_name : '?')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{contact.full_name}</p>
                                <p className="text-muted-foreground truncate text-xs">
                                    {contact.email ?? 'Sans e-mail'}
                                </p>
                            </div>
                            <Badge
                                variant={contact.is_eligible ? 'secondary' : 'outline'}
                                className="shrink-0 text-[10px]"
                            >
                                {contact.is_eligible ? 'OK' : 'Exclu'}
                            </Badge>
                        </li>
                    ))}
                </ul>
            )}

            {hiddenCount > 0 ? (
                <p className="text-muted-foreground text-center text-xs">
                    + {hiddenCount} autre{hiddenCount > 1 ? 's' : ''} contact
                    {hiddenCount > 1 ? 's' : ''}
                </p>
            ) : null}
        </section>
    );
}
