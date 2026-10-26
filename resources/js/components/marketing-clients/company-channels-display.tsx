import { useTrans as useUiTranslations } from '@/hooks/use-trans';
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
    const { t: uiText } = useUiTranslations();

    return (
        <div className="space-y-4">
            {channels.length > 0 ? (
                <ul className="space-y-2">
                    {channels.map((channel, index) => (
                        <li
                            key={`company-channel-${index}`}
                            className="flex flex-wrap items-center gap-2 text-sm"
                        >
                            <Badge variant="outline">
                                {channelLabel(channel.type)}
                            </Badge>
                            <span>{channel.value}</span>
                            {channel.label ? (
                                <span className="text-xs text-muted-foreground">
                                    ({channel.label})
                                </span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">
                    {uiText(
                        'ui.components.text_9f1ab72fb876',
                        'Aucun canal entreprise supplémentaire.',
                    )}
                </p>
            )}

            <div className="rounded-md bg-muted/40 p-3 text-xs">
                <p className="mb-2 font-medium">
                    {uiText(
                        'ui.components.text_eabc8df8b237',
                        'Utilisable en campagne',
                    )}
                </p>
                <ul className="space-y-1 text-muted-foreground">
                    <li>
                        {campaignChannels.emails.length}{' '}
                        {uiText('ui.components.text_3deffb092bc5', 'e-mail(s)')}
                    </li>
                    <li>
                        {campaignChannels.whatsapp.length}{' '}
                        {uiText('ui.components.text_6a40edf1fc87', 'WhatsApp')}
                    </li>
                    <li>
                        {campaignChannels.phones.length}{' '}
                        {uiText(
                            'ui.components.text_23a520905eca',
                            'téléphone(s)',
                        )}
                    </li>
                    {campaignChannels.cc_emails.length > 0 ? (
                        <li>
                            {uiText(
                                'ui.components.text_012409b0bb5d',
                                'Copie possible :',
                            )}{' '}
                            {campaignChannels.cc_emails.join(', ')}
                        </li>
                    ) : null}
                </ul>
            </div>
        </div>
    );
}
