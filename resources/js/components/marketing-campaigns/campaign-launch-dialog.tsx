import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { router } from '@inertiajs/react';
import { CalendarClock, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { launch } from '@/routes/marketing-campaigns';

type LaunchMode = 'now' | 'schedule';

type CampaignLaunchDialogProps = {
    campaignUuid: string;
    campaignName: string;
    scheduledAtFormatted?: string | null;
    triggerVariant?: 'default' | 'outline' | 'secondary';
    triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
    triggerLabel?: string;
};

function toLocalDateTimeValue(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function CampaignLaunchDialog({
    campaignUuid,
    campaignName,
    scheduledAtFormatted = null,
    triggerVariant = 'default',
    triggerSize = 'default',
    triggerLabel = 'Lancer la campagne',
}: CampaignLaunchDialogProps) {
    const { t: uiText } = useUiTranslations();

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<LaunchMode>('now');
    const [processing, setProcessing] = useState(false);
    const defaultSchedule = useMemo(() => {
        const date = new Date();
        date.setHours(date.getHours() + 1, 0, 0, 0);

        return toLocalDateTimeValue(date);
    }, []);
    const [scheduledAt, setScheduledAt] = useState(defaultSchedule);

    const handleSubmit = () => {
        setProcessing(true);

        let scheduledAtPayload: string | undefined = undefined;
        if (mode === 'schedule' && scheduledAt) {
            const dateObj = new Date(scheduledAt);
            scheduledAtPayload = !isNaN(dateObj.getTime())
                ? dateObj.toISOString()
                : scheduledAt;
        }

        router.post(
            launch.url(campaignUuid),
            mode === 'schedule' ? { scheduled_at: scheduledAtPayload } : {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setOpen(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} size={triggerSize}>
                    <Send className="size-4" aria-hidden />
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {uiText('ui.components.text_d2aa0156582f', 'Lancer «')}{' '}
                        {campaignName} »
                    </DialogTitle>
                    <DialogDescription>
                        {uiText(
                            'ui.components.text_d00449ae99a7',
                            'Envoyez immédiatement ou planifiez le lancement à une date future.',
                        )}{' '}
                        {scheduledAtFormatted
                            ? ` Planification actuelle : ${scheduledAtFormatted}.`
                            : ''}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setMode('now')}
                            className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                                mode === 'now'
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:bg-muted/40'
                            }`}
                        >
                            <span className="flex items-center gap-2 font-medium">
                                <Send className="size-4" aria-hidden />
                                {uiText(
                                    'ui.components.text_4303250da364',
                                    'Maintenant',
                                )}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                {uiText(
                                    'ui.components.text_b16f391d4c72',
                                    'Met les envois en file immédiatement.',
                                )}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('schedule')}
                            className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                                mode === 'schedule'
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:bg-muted/40'
                            }`}
                        >
                            <span className="flex items-center gap-2 font-medium">
                                <CalendarClock className="size-4" aria-hidden />
                                {uiText(
                                    'ui.components.text_2a858768800f',
                                    'Planifier',
                                )}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                {uiText(
                                    'ui.components.text_503fac4deae5',
                                    'Choisir une date et une heure de lancement.',
                                )}
                            </span>
                        </button>
                    </div>

                    {mode === 'schedule' ? (
                        <div className="space-y-2">
                            <Label htmlFor="scheduled_at">
                                {uiText(
                                    'ui.components.text_4891cd042a20',
                                    'Date et heure',
                                )}
                            </Label>
                            <Input
                                id="scheduled_at"
                                type="datetime-local"
                                value={scheduledAt}
                                min={toLocalDateTimeValue(new Date())}
                                onChange={(event) =>
                                    setScheduledAt(event.target.value)
                                }
                                required
                            />
                        </div>
                    ) : null}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={processing}
                    >
                        {uiText('ui.components.text_46ad3916f6a0', 'Annuler')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            processing || (mode === 'schedule' && !scheduledAt)
                        }
                    >
                        {processing
                            ? uiText(
                                  'ui.components.text_2e64da4c8af7',
                                  'En cours…',
                              )
                            : mode === 'schedule'
                              ? uiText(
                                    'ui.components.text_2a858768800f',
                                    'Planifier',
                                )
                              : uiText(
                                    'ui.components.text_0a1fcd4be879',
                                    'Lancer maintenant',
                                )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
