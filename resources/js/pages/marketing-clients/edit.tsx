import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import MarketingContactForm from '@/components/marketing-clients/marketing-contact-form';
import { useTrans } from '@/hooks/use-trans';
import { edit, index, show, update } from '@/routes/marketing-clients';

type ContactData = {
    uuid: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    is_company?: boolean;
    company_name?: string | null;
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
    const { t } = useTrans();
    const { contact, errors } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            {
                title: t('marketing_contacts.title', 'Contacts marketing'),
                href: index.url(),
            },
            {
                title: contact.full_name,
                href: show.url(contact.uuid),
            },
            {
                title: t('common.modify', 'Modifier'),
                href: edit.url(contact.uuid),
            },
        ],
    });

    return (
        <>
            <Head
                title={`${t('marketing_contacts.edit', 'Modifier le contact')} — ${contact.full_name}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <Link
                        href={show.url(contact.uuid)}
                        className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                    >
                        <ArrowLeft className="size-4" aria-hidden />
                        {t(
                            'marketing_contacts.back_to_detail',
                            'Retour au détail',
                        )}
                    </Link>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {t('marketing_contacts.edit', 'Modifier le contact')}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {contact.full_name}
                    </p>
                </div>

                <MarketingContactForm
                    submitUrl={update.url(contact.uuid)}
                    submitLabel={t('common.save', 'Enregistrer')}
                    cancelHref={show.url(contact.uuid)}
                    errors={errors}
                    contact={contact}
                    method="put"
                />
            </div>
        </>
    );
}
