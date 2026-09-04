import { AlertCircle, Loader2, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';

export type AudienceContact = {
    uuid: string;
    full_name: string;
    email: string | null;
    phone?: string | null;
    marketing_consent: boolean;
    is_eligible: boolean;
};

export type AudiencePreviewPayload = {
    contacts: AudienceContact[];
    stats: {
        total: number;
        eligible: number;
        ineligible: number;
        lists_count?: number;
        direct_contacts_count?: number;
    };
};

type CampaignAudiencePanelProps = {
    audience: AudiencePreviewPayload | null;
    loading: boolean;
    error: string | null;
    channel: string;
};

const PREVIEW_LIMIT = 12;

export default function CampaignAudiencePanel({
    audience,
    loading,
    error,
    channel,
}: CampaignAudiencePanelProps) {
    const getInitials = useInitials();
    const eligibilityHint =
        channel === 'whatsapp'
            ? 'Seuls les contacts avec consentement marketing et un téléphone recevront la campagne WhatsApp.'
            : 'Seuls les contacts avec consentement marketing et une adresse e-mail recevront la campagne.';

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
            <div className="flex items-center gap-2 text-sm font-semibold">
                <Users className="size-4" aria-hidden />
                Audience fusionnée
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{audience.stats.total} contact(s)</Badge>
                <Badge variant="default">{audience.stats.eligible} éligible(s)</Badge>
                {audience.stats.ineligible > 0 ? (
                    <Badge variant="outline">{audience.stats.ineligible} exclus</Badge>
                ) : null}
                {(audience.stats.lists_count ?? 0) > 0 ? (
                    <Badge variant="outline">
                        {audience.stats.lists_count} groupe
                        {(audience.stats.lists_count ?? 0) > 1 ? 's' : ''}
                    </Badge>
                ) : null}
                {(audience.stats.direct_contacts_count ?? 0) > 0 ? (
                    <Badge variant="outline">
                        {audience.stats.direct_contacts_count} contact
                        {(audience.stats.direct_contacts_count ?? 0) > 1 ? 's' : ''} direct
                        {(audience.stats.direct_contacts_count ?? 0) > 1 ? 's' : ''}
                    </Badge>
                ) : null}
            </div>

            {audience.stats.ineligible > 0 ? (
                <p className="text-muted-foreground flex items-start gap-2 text-xs">
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    {eligibilityHint}
                </p>
            ) : null}

            {audience.contacts.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                    Aucun contact dans l&apos;audience sélectionnée.
                </p>
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
                                    {channel === 'whatsapp'
                                        ? (contact.phone ?? contact.email ?? 'Sans téléphone')
                                        : (contact.email ?? 'Sans e-mail')}
                                </p>
                            </div>
                            {!contact.is_eligible ? (
                                <Badge variant="outline" className="shrink-0 text-[10px]">
                                    Exclu
                                </Badge>
                            ) : null}
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
