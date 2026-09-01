import { router } from '@inertiajs/react';
import { UserMinus } from 'lucide-react';
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
import { detach } from '@/routes/marketing-lists/contacts';

type RemoveContactDialogProps = {
    listUuid: string;
    contactUuid: string;
    contactName: string;
};

export default function RemoveContactDialog({
    listUuid,
    contactUuid,
    contactName,
}: RemoveContactDialogProps) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleConfirm = () => {
        setProcessing(true);
        router.delete(detach.url([listUuid, contactUuid]), {
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
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    aria-label={`Retirer ${contactName}`}
                >
                    <UserMinus className="size-4" aria-hidden />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Retirer ce contact ?</DialogTitle>
                    <DialogDescription>
                        « {contactName} » sera retiré de cette liste. Le contact restera dans votre base.
                    </DialogDescription>
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
                        {processing ? 'Retrait…' : 'Retirer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
