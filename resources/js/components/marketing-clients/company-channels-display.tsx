import { Badge } from '@/components/ui/badge';
import {
    MARKETING_COMPANY_CONTACT_CHANNEL_OPTIONS,
    type MarketingCompanyChannel,
} from '@/types/marketing-company-contact';

type CampaignChannelEntry = {
    value: string;
    label: string | null;
    person_name: string | null;
    scope: string;
};

type CampaignChannels = {
    emails: CampaignChannelEntry[];
    phones: CampaignChannelEntry[];
    whatsapp: CampaignChannelEntry[];
    cc_emails: string[];
};

function channelLabel(type: string): string {
    return (
        MARKETING_COMPANY_CONTACT_CHANNEL_OPTIONS.find(
            (option) => option.value === type,
        )?.label ?? type
    );
}

export function CompanyChannelsDisplay({
    channels,
    campaignChannels,
}: {
    channels: MarketingCompanyChannel[];
    campaignChannels: CampaignChannels;
}) {
    return (
        <div className="space-y-4">
            {channels.length > 0 ? (
                <ul className="space-y-2">
                    {channels.map((channel, index) => (
                        <li
                            key={`company-channel-${index}`}
                            className="flex flex-wrap items-center gap-2 text-sm"
                        >
                            <Badge variant="outline">{channelLabel(channel.type)}</Badge>
                            <span>{channel.value}</span>
                            {channel.label ? (
                                <span className="text-muted-foreground text-xs">
                                    ({channel.label})
                                </span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm">
                    Aucun canal entreprise supplémentaire.
                </p>
            )}

            <div className="rounded-md bg-muted/40 p-3 text-xs">
                <p className="mb-2 font-medium">Utilisable en campagne</p>
                <ul className="text-muted-foreground space-y-1">
                    <li>{campaignChannels.emails.length} e-mail(s)</li>
                    <li>{campaignChannels.whatsapp.length} WhatsApp</li>
                    <li>{campaignChannels.phones.length} téléphone(s)</li>
                    {campaignChannels.cc_emails.length > 0 ? (
                        <li>Copie possible : {campaignChannels.cc_emails.join(', ')}</li>
                    ) : null}
                </ul>
            </div>
        </div>
    );
}
