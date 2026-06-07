import { Form, usePage } from '@inertiajs/react';
import { CheckCircle2, Send } from 'lucide-react';
import { useState } from 'react';
import LocationCascadingSelects, {
    type LocationValues,
} from '@/components/marketing/location-cascading-selects';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/devenir-agent';
import { cn } from '@/lib/utils';

type AvailabilityOption = { value: string; label: string };
type PostOption = { value: string; label: string };

type PageProps = {
    availabilityOptions: AvailabilityOption[];
    postOptions: PostOption[];
    flash: { success?: string | null };
};

const fieldClasses =
    'border-super-securite-border bg-super-securite-surface-elevated text-super-securite-heading placeholder:text-super-securite-muted focus-visible:border-super-securite-accent focus-visible:ring-super-securite-accent/30';

export default function SecurityAgentRegistrationForm() {
    const { availabilityOptions, postOptions } = usePage<PageProps>().props;
    const [location, setLocation] = useState<LocationValues>({
        region_id: '',
        prefecture_id: '',
        commune_id: '',
    });

    return (
        <div className="marketing-card relative overflow-hidden">
            <div
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-super-securite-accent/10 blur-3xl"
                aria-hidden
            />

            <div className="relative">
                <p className="marketing-label mb-2">Candidature agent</p>
                <h2 className="font-heading text-2xl font-semibold text-super-securite-heading">
                    Rejoignez notre réseau d&apos;agents
                </h2>
                <p className="mt-2 text-sm text-super-securite-muted">
                    Les champs marqués d&apos;un{' '}
                    <span className="text-super-securite-accent">*</span> sont
                    obligatoires.
                </p>

                <Form
                    {...store.form()}
                    resetOnSuccess={[
                        'first_name',
                        'last_name',
                        'phone',
                        'email',
                        'post',
                        'experience_years',
                        'availability',
                        'certifications',
                        'motivation',
                        'address_detail',
                        'consent',
                    ]}
                    onSuccess={() =>
                        setLocation({
                            region_id: '',
                            prefecture_id: '',
                            commune_id: '',
                        })
                    }
                    className="mt-8 flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                className="hidden"
                                aria-hidden
                            />

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">
                                        Prénom{' '}
                                        <span className="text-super-securite-accent">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        required
                                        className={fieldClasses}
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">
                                        Nom{' '}
                                        <span className="text-super-securite-accent">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        required
                                        className={fieldClasses}
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">
                                        Téléphone{' '}
                                        <span className="text-super-securite-accent">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        placeholder="+224 6XX XX XX XX"
                                        className={fieldClasses}
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="vous@exemple.com"
                                        className={fieldClasses}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="post">
                                        Poste{' '}
                                        <span className="text-super-securite-accent">
                                            *
                                        </span>
                                    </Label>
                                    <select
                                        id="post"
                                        name="post"
                                        required
                                        defaultValue=""
                                        className={cn(
                                            fieldClasses,
                                            'h-10 w-full rounded-md border px-3 text-sm',
                                        )}
                                    >
                                        <option value="">
                                            Sélectionner un poste...
                                        </option>
                                        {postOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.post} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="experience_years">
                                        Années d&apos;expérience
                                    </Label>
                                    <Input
                                        id="experience_years"
                                        name="experience_years"
                                        type="number"
                                        min={0}
                                        max={50}
                                        className={fieldClasses}
                                    />
                                    <InputError
                                        message={errors.experience_years}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2 sm:max-w-md">
                                <Label htmlFor="availability">
                                    Disponibilité
                                </Label>
                                <select
                                    id="availability"
                                    name="availability"
                                    defaultValue=""
                                    className={cn(
                                        fieldClasses,
                                        'h-10 w-full rounded-md border px-3 text-sm',
                                    )}
                                >
                                    <option value="">Sélectionner...</option>
                                    {availabilityOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.availability} />
                            </div>

                            <div className="rounded-xl border border-super-securite-border bg-super-securite-surface/50 p-5">
                                <h3 className="font-heading mb-4 font-semibold text-super-securite-heading">
                                    Localisation en Guinée
                                </h3>
                                <LocationCascadingSelects
                                    values={location}
                                    onChange={setLocation}
                                    errors={errors}
                                />
                                <div className="mt-5 grid gap-2">
                                    <Label htmlFor="address_detail">
                                        Adresse complémentaire
                                    </Label>
                                    <Input
                                        id="address_detail"
                                        name="address_detail"
                                        placeholder="Repère, rue, secteur..."
                                        className={fieldClasses}
                                    />
                                    <InputError
                                        message={errors.address_detail}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="certifications">
                                    Certifications / formations
                                </Label>
                                <Textarea
                                    id="certifications"
                                    name="certifications"
                                    rows={3}
                                    className={fieldClasses}
                                    placeholder="Permis, CQP, formations sécurité..."
                                />
                                <InputError message={errors.certifications} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="motivation">Motivation</Label>
                                <Textarea
                                    id="motivation"
                                    name="motivation"
                                    rows={4}
                                    className={fieldClasses}
                                    placeholder="Pourquoi souhaitez-vous rejoindre Super Sécurité ?"
                                />
                                <InputError message={errors.motivation} />
                            </div>

                            <label className="flex items-start gap-3 text-sm text-super-securite-muted">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    value="1"
                                    required
                                    className="mt-1 size-4 rounded border-super-securite-border"
                                />
                                <span>
                                    J&apos;accepte que mes informations soient
                                    utilisées par Super Sécurité pour me
                                    recontacter dans le cadre du recrutement.
                                </span>
                            </label>
                            <InputError message={errors.consent} />

                            <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-super-securite-muted">
                                    Vos données restent confidentielles et ne
                                    sont jamais partagées à des tiers.
                                </p>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="marketing-cta-primary marketing-magnetic group inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="size-4" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            Envoyer ma candidature
                                            <Send
                                                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                                                aria-hidden
                                            />
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
