export type MarketingCompanyContactChannelType = 'email' | 'phone' | 'whatsapp';

export type MarketingCompanyChannel = {
    type: MarketingCompanyContactChannelType;
    value: string;
    label?: string | null;
};

/** @deprecated Format legacy — interlocuteurs imbriqués. */
export type MarketingCompanyContactPerson = {
    name?: string | null;
    role?: string | null;
    channels: MarketingCompanyChannel[];
};

export const MARKETING_COMPANY_CONTACT_CHANNEL_OPTIONS: Array<{
    value: MarketingCompanyContactChannelType;
    label: string;
}> = [
    { value: 'email', label: 'E-mail' },
    { value: 'phone', label: 'Téléphone' },
    { value: 'whatsapp', label: 'WhatsApp' },
];

export function emptyCompanyChannel(): MarketingCompanyChannel {
    return { type: 'email', value: '', label: '' };
}

export function normalizeCompanyChannels(
    value: MarketingCompanyChannel[] | MarketingCompanyContactPerson[] | null | undefined,
): MarketingCompanyChannel[] {
    if (!value?.length) {
        return [];
    }

    const first = value[0];

    if (first && 'channels' in first && Array.isArray(first.channels)) {
        return (value as MarketingCompanyContactPerson[]).flatMap((person) =>
            (person.channels ?? []).map((channel) => ({
                type: channel.type,
                value: channel.value ?? '',
                label: channel.label ?? '',
            })),
        );
    }

    return (value as MarketingCompanyChannel[]).map((channel) => ({
        type: channel.type,
        value: channel.value ?? '',
        label: channel.label ?? '',
    }));
}
