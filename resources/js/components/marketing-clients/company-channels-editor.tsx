import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InternationalPhoneInput from '@/components/ui/international-phone-input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    emptyCompanyChannel,
    MARKETING_COMPANY_CONTACT_CHANNEL_OPTIONS,
    normalizeCompanyChannels,
    type MarketingCompanyChannel,
    type MarketingCompanyContactChannelType,
} from '@/types/marketing-company-contact';

type CompanyChannelsEditorProps = {
    initialValue?: MarketingCompanyChannel[] | null;
    errors?: Record<string, string>;
};

function isPhoneChannel(type: MarketingCompanyContactChannelType): boolean {
    return type === 'phone' || type === 'whatsapp';
}

export default function CompanyChannelsEditor({
    initialValue,
    errors = {},
}: CompanyChannelsEditorProps) {
    const [channels, setChannels] = useState<MarketingCompanyChannel[]>(() =>
        normalizeCompanyChannels(initialValue),
    );

    const updateChannels = (next: MarketingCompanyChannel[]) => {
        setChannels(next);
    };

    const addChannel = () => {
        updateChannels([...channels, emptyCompanyChannel()]);
    };

    const removeChannel = (index: number) => {
        updateChannels(channels.filter((_, channelIndex) => channelIndex !== index));
    };

    const updateChannel = (
        index: number,
        patch: Partial<MarketingCompanyChannel>,
    ) => {
        updateChannels(
            channels.map((channel, channelIndex) =>
                channelIndex === index ? { ...channel, ...patch } : channel,
            ),
        );
    };

    return (
        <div className="space-y-3">
            <input
                type="hidden"
                name="company_contacts"
                value={JSON.stringify(
                    channels
                        .filter((channel) => channel.value.trim() !== '')
                        .map((channel) => ({
                            type: channel.type,
                            value: channel.value.trim(),
                            label: channel.label?.trim() || null,
                        })),
                )}
            />

            <p className="text-muted-foreground text-xs">
                Canaux supplémentaires de l&apos;entreprise (e-mail, téléphone, WhatsApp)
                pour les campagnes et mises en copie — l&apos;interlocuteur principal est
                renseigné ci-dessus.
            </p>

            {errors.company_contacts ? (
                <p className="text-sm text-destructive">{errors.company_contacts}</p>
            ) : null}

            {channels.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                    Aucun canal entreprise supplémentaire.
                </p>
            ) : null}

            {channels.map((channel, channelIndex) => {
                const valueErrorKey = `company_contacts.${channelIndex}.value`;
                const typeErrorKey = `company_contacts.${channelIndex}.type`;

                return (
                    <div
                        key={`company-channel-${channelIndex}`}
                        className="grid gap-2 rounded-md border border-dashed border-border/70 p-3 md:grid-cols-[160px_1fr_1fr_auto]"
                    >
                        <div className="space-y-1">
                            <Label className="text-xs">Type</Label>
                            <Select
                                value={channel.type}
                                onValueChange={(value) =>
                                    updateChannel(channelIndex, {
                                        type: value as MarketingCompanyContactChannelType,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MARKETING_COMPANY_CONTACT_CHANNEL_OPTIONS.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                            {errors[typeErrorKey] ? (
                                <p className="text-xs text-destructive">
                                    {errors[typeErrorKey]}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs">Valeur</Label>
                            {isPhoneChannel(channel.type) ? (
                                <InternationalPhoneInput
                                    value={channel.value}
                                    onChange={(phone) =>
                                        updateChannel(channelIndex, {
                                            value: phone,
                                        })
                                    }
                                    aria-invalid={Boolean(errors[valueErrorKey])}
                                />
                            ) : (
                                <Input
                                    value={channel.value}
                                    onChange={(event) =>
                                        updateChannel(channelIndex, {
                                            value: event.target.value,
                                        })
                                    }
                                    placeholder="compta@entreprise.com"
                                />
                            )}
                            {errors[valueErrorKey] ? (
                                <p className="text-xs text-destructive">
                                    {errors[valueErrorKey]}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs">Libellé (optionnel)</Label>
                            <Input
                                value={channel.label ?? ''}
                                onChange={(event) =>
                                    updateChannel(channelIndex, {
                                        label: event.target.value,
                                    })
                                }
                                placeholder="Compta, Standard…"
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeChannel(channelIndex)}
                                aria-label="Supprimer le canal"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                );
            })}

            <Button type="button" variant="outline" size="sm" onClick={addChannel}>
                <Plus className="size-4" aria-hidden />
                Ajouter un canal
            </Button>
        </div>
    );
}
