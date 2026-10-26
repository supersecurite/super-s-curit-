import { useTrans as useUiTranslations } from '@/hooks/use-trans';
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
import { SearchableMultiSelect } from '@/components/ui/searchable-multi-select';
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
    const { t: uiText } = useUiTranslations();

    const [open, setOpen] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

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
                    setSelectedContacts([]);
                }
            }}
        >
            <DialogTrigger asChild>
                <Button type="button">
                    <Plus className="size-4" aria-hidden />
                    {uiText(
                        'ui.components.text_07a06f50446d',
                        'Ajouter des contacts',
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {uiText(
                            'ui.components.text_07a06f50446d',
                            'Ajouter des contacts',
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {uiText(
                            'ui.components.text_b8529fbdcfe6',
                            'Recherchez puis sélectionnez un ou plusieurs contacts à inclure dans ce groupe.',
                        )}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={attach.url(listUuid)}
                    method="post"
                    resetOnSuccess
                    onSuccess={() => {
                        setOpen(false);
                        setSelectedContacts([]);
                    }}
                    className="space-y-4"
                >
                    {({ processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="contact_uuids">
                                    {uiText(
                                        'ui.components.text_b450645debe2',
                                        'Contacts',
                                    )}
                                </Label>
                                <SearchableMultiSelect
                                    id="contact_uuids"
                                    name="contact_uuids"
                                    options={options}
                                    value={selectedContacts}
                                    onChange={setSelectedContacts}
                                    placeholder={uiText(
                                        'ui.components.text_448668bcbddc',
                                        'Sélectionner des contacts…',
                                    )}
                                    searchPlaceholder={uiText(
                                        'ui.components.text_46b23b86fcce',
                                        'Rechercher par nom ou e-mail…',
                                    )}
                                    emptyMessage={uiText(
                                        'ui.components.text_e510937c4356',
                                        'Aucun contact disponible',
                                    )}
                                />
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    {uiText(
                                        'ui.components.text_46ad3916f6a0',
                                        'Annuler',
                                    )}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        availableContacts.length === 0 ||
                                        selectedContacts.length === 0
                                    }
                                >
                                    {selectedContacts.length > 1
                                        ? `Ajouter (${selectedContacts.length})`
                                        : uiText(
                                              'ui.components.text_00f9c5334547',
                                              'Ajouter',
                                          )}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
