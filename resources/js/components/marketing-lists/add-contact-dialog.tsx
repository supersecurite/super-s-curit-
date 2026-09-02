import { Form } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { attach } from '@/routes/marketing-lists/contacts';

type ContactOption = {
    uuid: string;
    full_name: string;
    email: string | null;
};

type AddContactDialogProps = {
    listUuid: string;
    availableContacts: ContactOption[];
};

export default function AddContactDialog({
    listUuid,
    availableContacts,
}: AddContactDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState('');

    const options = useMemo(
        () =>
            availableContacts.map((contact) => ({
                value: contact.uuid,
                label: contact.email
                    ? `${contact.full_name} — ${contact.email}`
                    : contact.full_name,
            })),
        [availableContacts],
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                    setSelectedContact('');
                }
            }}
        >
            <DialogTrigger asChild>
                <Button type="button">
                    <Plus className="size-4" aria-hidden />
                    Ajouter un contact
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajouter un contact</DialogTitle>
                    <DialogDescription>
                        Recherchez puis sélectionnez un contact à inclure dans ce groupe.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={attach.url(listUuid)}
                    method="post"
                    resetOnSuccess
                    onSuccess={() => {
                        setOpen(false);
                        setSelectedContact('');
                    }}
                    className="space-y-4"
                >
                    {({ processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="contact_uuid">Contact</Label>
                                <SearchableSelect
                                    id="contact_uuid"
                                    name="contact_uuid"
                                    options={options}
                                    value={selectedContact}
                                    onChange={setSelectedContact}
                                    placeholder="Sélectionner un contact…"
                                    searchPlaceholder="Rechercher par nom ou e-mail..."
                                    emptyMessage="Aucun contact disponible"
                                    required
                                />
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        availableContacts.length === 0 ||
                                        selectedContact === ''
                                    }
                                >
                                    Ajouter
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
