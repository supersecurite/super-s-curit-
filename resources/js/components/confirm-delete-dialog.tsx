import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type ConfirmDeleteDialogProps = {
    title: string;
    description: string;
    deleteUrl: string;
    triggerLabel?: string;
    triggerVariant?: 'destructive' | 'outline';
    triggerSize?: 'default' | 'sm' | 'icon';
    triggerClassName?: string;
    'aria-label'?: string;
};

export default function ConfirmDeleteDialog({
    title,
    description,
    deleteUrl,
    triggerLabel = 'Supprimer',
    triggerVariant = 'destructive',
    triggerSize = 'default',
    triggerClassName,
    'aria-label': ariaLabel,
}: ConfirmDeleteDialogProps) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleConfirm = () => {
        setProcessing(true);
        router.delete(deleteUrl, {
            onFinish: () => {
                setProcessing(false);
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant={triggerVariant}
                    size={triggerSize}
                    className={triggerClassName}
                    aria-label={ariaLabel ?? triggerLabel}
                >
                    {triggerSize === 'icon' ? (
                        <Trash2 className="size-4" aria-hidden />
                    ) : (
                        triggerLabel
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={processing}>
                            Annuler
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={processing}
                        onClick={handleConfirm}
                    >
                        {processing ? 'Suppression…' : 'Confirmer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
