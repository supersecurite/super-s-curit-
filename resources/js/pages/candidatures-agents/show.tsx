import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    Mail,
    MapPin,
    Phone,
    Save,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { index, show, update } from '@/routes/candidatures-agents';

type ApplicationDetail = {
    uuid: string;
    full_name: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string | null;
    post_label: string | null;
    experience_years: number | null;
    availability_label: string | null;
    certifications: string | null;
    motivation: string | null;
    location_summary: string;
    region_name: string;
    prefecture_name: string;
    commune_name: string | null;
    address_detail: string | null;
    status: string;
    status_label: string;
    internal_notes: string | null;
    reviewed_by: { id: number; name: string } | null;
    contacted_at_formatted: string | null;
    created_at_formatted: string | null;
};

type StatusOption = { value: string; label: string };

type PageProps = {
    application: ApplicationDetail;
    statusOptions: StatusOption[];
    canUpdate: boolean;
};

export default function CandidaturesAgentsShow() {
    const { application, statusOptions, canUpdate } =
        usePage<PageProps>().props;

    const form = useForm({
        status: application.status,
        internal_notes: application.internal_notes ?? '',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        form.put(update.url(application.uuid), { preserveScroll: true });
    };

    return (
        <>
            <Head title={`Candidature — ${application.full_name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link
                            href={index.url()}
                            className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                        >
                            <ArrowLeft className="size-4" />
                            Retour à la liste
                        </Link>
                        <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <User className="size-6" />
                            {application.full_name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge>{application.status_label}</Badge>
                            {application.post_label ? (
                                <Badge variant="outline">
                                    <Briefcase className="mr-1 size-3" />
                                    {application.post_label}
                                </Badge>
                            ) : null}
                            {application.created_at_formatted ? (
                                <span className="text-muted-foreground flex items-center gap-1 text-sm">
                                    <Calendar className="size-4" />
                                    {application.created_at_formatted}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="app-panel space-y-4 p-6">
                            <h2 className="font-heading text-lg font-semibold">
                                Coordonnées
                            </h2>
                            <div className="grid gap-3 text-sm">
                                {application.post_label ? (
                                    <p className="flex items-center gap-2">
                                        <Briefcase className="text-muted-foreground size-4" />
                                        <span>
                                            <span className="font-medium">
                                                Poste :
                                            </span>{' '}
                                            {application.post_label}
                                        </span>
                                    </p>
                                ) : null}
                                <p className="flex items-center gap-2">
                                    <Phone className="text-muted-foreground size-4" />
                                    <a href={`tel:${application.phone}`}>
                                        {application.phone}
                                    </a>
                                </p>
                                {application.email ? (
                                    <p className="flex items-center gap-2">
                                        <Mail className="text-muted-foreground size-4" />
                                        <a href={`mailto:${application.email}`}>
                                            {application.email}
                                        </a>
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="app-panel space-y-4 p-6">
                            <h2 className="font-heading text-lg font-semibold">
                                Localisation
                            </h2>
                            <div className="text-sm">
                                <p className="flex items-start gap-2">
                                    <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                    <span>
                                        {application.location_summary}
                                        {application.address_detail
                                            ? ` — ${application.address_detail}`
                                            : ''}
                                    </span>
                                </p>
                                <ul className="text-muted-foreground mt-3 space-y-1">
                                    <li>Région : {application.region_name}</li>
                                    <li>
                                        Préfecture : {application.prefecture_name}
                                    </li>
                                    {application.commune_name ? (
                                        <li>
                                            Commune : {application.commune_name}
                                        </li>
                                    ) : null}
                                </ul>
                            </div>
                        </div>

                        {(application.certifications ||
                            application.motivation ||
                            application.availability_label ||
                            application.experience_years !== null) && (
                            <div className="app-panel space-y-4 p-6">
                                <h2 className="font-heading text-lg font-semibold">
                                    Profil
                                </h2>
                                <div className="space-y-3 text-sm">
                                    {application.experience_years !== null ? (
                                        <p>
                                            <span className="font-medium">
                                                Expérience :
                                            </span>{' '}
                                            {application.experience_years}{' '}
                                            an(s)
                                        </p>
                                    ) : null}
                                    {application.availability_label ? (
                                        <p>
                                            <span className="font-medium">
                                                Disponibilité :
                                            </span>{' '}
                                            {application.availability_label}
                                        </p>
                                    ) : null}
                                    {application.certifications ? (
                                        <div>
                                            <p className="font-medium">
                                                Certifications
                                            </p>
                                            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                                                {application.certifications}
                                            </p>
                                        </div>
                                    ) : null}
                                    {application.motivation ? (
                                        <div>
                                            <p className="font-medium">
                                                Motivation
                                            </p>
                                            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                                                {application.motivation}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>

                    {canUpdate ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="app-panel space-y-4 p-6">
                                <h2 className="font-heading text-lg font-semibold">
                                    Suivi interne
                                </h2>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Statut</Label>
                                    <select
                                        id="status"
                                        value={form.data.status}
                                        onChange={(e) =>
                                            form.setData('status', e.target.value)
                                        }
                                        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                                    >
                                        {statusOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={form.errors.status} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="internal_notes">
                                        Notes internes
                                    </Label>
                                    <textarea
                                        id="internal_notes"
                                        rows={6}
                                        value={form.data.internal_notes}
                                        onChange={(e) =>
                                            form.setData(
                                                'internal_notes',
                                                e.target.value,
                                            )
                                        }
                                        className="border-input bg-background min-h-[120px] w-full rounded-md border px-3 py-2 text-sm"
                                        placeholder="Commentaires RH, rappels, entretien..."
                                    />
                                    <InputError
                                        message={form.errors.internal_notes}
                                    />
                                </div>

                                {application.reviewed_by ? (
                                    <p className="text-muted-foreground text-xs">
                                        Dernière mise à jour par{' '}
                                        {application.reviewed_by.name}
                                        {application.contacted_at_formatted
                                            ? ` — contacté le ${application.contacted_at_formatted}`
                                            : ''}
                                    </p>
                                ) : null}

                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full"
                                >
                                    <Save className="size-4" />
                                    {form.processing
                                        ? 'Enregistrement...'
                                        : 'Enregistrer'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="app-panel space-y-4 p-6">
                            <h2 className="font-heading text-lg font-semibold">
                                Suivi interne
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Vous n&apos;avez pas l&apos;autorisation de
                                modifier cette candidature.
                            </p>
                            {application.internal_notes ? (
                                <div className="grid gap-2">
                                    <Label>Notes internes</Label>
                                    <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                                        {application.internal_notes}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

CandidaturesAgentsShow.layout = {
    breadcrumbs: [
        { title: 'Candidatures agents', href: index.url() },
        { title: 'Détail', href: show.url('') },
    ],
};
