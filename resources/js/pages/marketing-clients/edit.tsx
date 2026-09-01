import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import MarketingContactForm from '@/components/marketing-clients/marketing-contact-form';
import { edit, show, update } from '@/routes/marketing-clients';

type ContactData = {
    uuid: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    tags: string[];
    marketing_consent: boolean;
    notes: string | null;
    full_name: string;
};

type PageProps = {
    contact: ContactData;
    errors: Record<string, string>;
};

export default function MarketingClientsEdit() {
    const { contact, errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Contacts marketing', href: show.url(contact.uuid) },
            { title: 'Modifier', href: edit.url(contact.uuid) },
        ],
    });

    return (
        <>
            <Head title={`Modifier ${contact.full_name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <Link
                        href={show.url(contact.uuid)}
                        className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                    >
                        <ArrowLeft className="size-4" aria-hidden />
                        Retour au détail
                    </Link>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Modifier le contact
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {contact.full_name}
                    </p>
                </div>

                <MarketingContactForm
                    submitUrl={update.url(contact.uuid)}
                    submitLabel="Enregistrer"
                    cancelHref={show.url(contact.uuid)}
                    errors={errors}
                    contact={contact}
                    method="put"
                />
            </div>
        </>
    );
}

MarketingClientsEdit.layout = {
    breadcrumbs: [
        { title: 'Modifier le contact', href: edit.url('') },
    ],
};
