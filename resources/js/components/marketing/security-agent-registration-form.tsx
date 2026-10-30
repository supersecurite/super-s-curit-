import { Form, usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import CommuneSearchSelect from '@/components/marketing/commune-search-select';
import RecaptchaField from '@/components/marketing/recaptcha-field';
import type {RecaptchaFieldHandle} from '@/components/marketing/recaptcha-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useTrans } from '@/hooks/use-trans';
import { store } from '@/routes/devenir-agent';

type AvailabilityOption = { value: string; label: string };
type PostOption = { value: string; label: string };

type PageProps = {
    availabilityOptions: AvailabilityOption[];
    postOptions: PostOption[];
    flash: { success?: string | null };
    recaptcha: {
        enabled: boolean;
        siteKey: string | null;
        language: string;
    };
};

const fieldClasses =
    'border-super-securite-border bg-super-securite-surface-elevated text-super-securite-heading placeholder:text-super-securite-muted focus-visible:border-super-securite-accent focus-visible:ring-super-securite-accent/30';

export default function SecurityAgentRegistrationForm() {
    const { availabilityOptions, postOptions, recaptcha } =
        usePage<PageProps>().props;
    const { t } = useTrans();
    const [communeId, setCommuneId] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const recaptchaRef = useRef<RecaptchaFieldHandle>(null);

    const localizedPostOptions = useMemo(
        () =>
            postOptions.map((opt) => ({
                value: opt.value,
                label: t(`devenir_agent.posts.${opt.value}`, opt.label),
            })),
        [postOptions, t],
    );

    const localizedAvailabilityOptions = useMemo(
        () =>
            availabilityOptions.map((opt) => ({
                value: opt.value,
                label: t(`devenir_agent.availability.${opt.value}`, opt.label),
            })),
        [availabilityOptions, t],
    );

    return (
        <div className="marketing-card relative overflow-hidden">
            <div
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-super-securite-accent/10 blur-3xl"
                aria-hidden
            />

            <div className="relative">
                <p className="marketing-label mb-2">
                    {t('devenir_agent.form.badge', 'Candidature')}
                </p>
                <h2 className="font-heading text-2xl font-semibold text-super-securite-heading">
                    {t('recruitment_v2.form_title')}
                </h2>
                <p className="mt-2 text-sm text-super-securite-muted">
                    {t(
                        'devenir_agent.form.required_hint',
                        "Les champs marqués d'un * sont obligatoires.",
                    )}
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
                    onSuccess={() => {
                        setCommuneId('');
                        setRecaptchaToken('');
                        recaptchaRef.current?.reset();
                    }}
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

                            <fieldset className="recruitment-v2-fieldset">
                                <legend>
                                    <span>1</span>
                                    {t('recruitment_v2.coordinates')}
                                </legend>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">
                                            {t(
                                                'devenir_agent.form.first_name',
                                                'Prénom',
                                            )}{' '}
                                            <span className="text-super-securite-accent">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            placeholder={t(
                                                'devenir_agent.form.first_name_placeholder',
                                                'Votre prénom',
                                            )}
                                            required
                                            className={fieldClasses}
                                        />
                                        <InputError
                                            message={errors.first_name}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">
                                            {t(
                                                'devenir_agent.form.last_name',
                                                'Nom',
                                            )}{' '}
                                            <span className="text-super-securite-accent">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            placeholder={t(
                                                'devenir_agent.form.last_name_placeholder',
                                                'Votre nom',
                                            )}
                                            required
                                            className={fieldClasses}
                                        />
                                        <InputError
                                            message={errors.last_name}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">
                                            {t(
                                                'devenir_agent.form.phone',
                                                'Téléphone',
                                            )}{' '}
                                            <span className="text-super-securite-accent">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder={t(
                                                'devenir_agent.form.phone_placeholder',
                                                '+224 6XX XX XX XX',
                                            )}
                                            className={fieldClasses}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            {t(
                                                'devenir_agent.form.email',
                                                'E-mail',
                                            )}
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder={t(
                                                'devenir_agent.form.email_placeholder',
                                                'vous@exemple.com',
                                            )}
                                            className={fieldClasses}
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="recruitment-v2-fieldset">
                                <legend>
                                    <span>2</span>
                                    {t('recruitment_v2.profile')}
                                </legend>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="post">
                                            {t(
                                                'devenir_agent.form.post',
                                                'Poste',
                                            )}{' '}
                                            <span className="text-super-securite-accent">
                                                *
                                            </span>
                                        </Label>
                                        <SearchableSelect
                                            id="post"
                                            name="post"
                                            options={localizedPostOptions}
                                            placeholder={t(
                                                'devenir_agent.form.post_placeholder',
                                                'Sélectionner un poste...',
                                            )}
                                            searchPlaceholder={t(
                                                'devenir_agent.form.post_search_placeholder',
                                                'Rechercher un poste...',
                                            )}
                                            emptyMessage={t(
                                                'devenir_agent.form.post_empty',
                                                'Aucun poste trouvé',
                                            )}
                                            required
                                            variant="underline"
                                            triggerClassName={fieldClasses}
                                        />
                                        <InputError message={errors.post} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="experience_years">
                                            {t(
                                                'devenir_agent.form.experience_years',
                                                "Années d'expérience",
                                            )}
                                        </Label>
                                        <Input
                                            id="experience_years"
                                            name="experience_years"
                                            type="number"
                                            min={0}
                                            max={50}
                                            placeholder={t(
                                                'devenir_agent.form.experience_years_placeholder',
                                                '0',
                                            )}
                                            className={fieldClasses}
                                        />
                                        <InputError
                                            message={errors.experience_years}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2 sm:max-w-md">
                                    <Label htmlFor="availability">
                                        {t(
                                            'devenir_agent.form.availability',
                                            'Disponibilité',
                                        )}
                                    </Label>
                                    <SearchableSelect
                                        id="availability"
                                        name="availability"
                                        options={localizedAvailabilityOptions}
                                        placeholder={t(
                                            'devenir_agent.form.availability_placeholder',
                                            'Sélectionner...',
                                        )}
                                        searchPlaceholder={t(
                                            'devenir_agent.form.availability_search_placeholder',
                                            'Rechercher...',
                                        )}
                                        emptyMessage={t(
                                            'devenir_agent.form.availability_empty',
                                            'Aucune disponibilité trouvée',
                                        )}
                                        variant="underline"
                                        triggerClassName={fieldClasses}
                                    />
                                    <InputError message={errors.availability} />
                                </div>

                                <div className="rounded-xl border border-super-securite-border bg-super-securite-surface/50 p-5">
                                    <h3 className="mb-4 font-heading font-semibold text-super-securite-heading">
                                        {t(
                                            'devenir_agent.form.location_title',
                                            'Localisation en Guinée',
                                        )}
                                    </h3>
                                    <CommuneSearchSelect
                                        value={communeId}
                                        onChange={setCommuneId}
                                        error={errors.commune_id}
                                        fieldClasses={fieldClasses}
                                    />
                                    <div className="mt-5 grid gap-2">
                                        <Label htmlFor="address_detail">
                                            {t(
                                                'devenir_agent.form.address_detail',
                                                'Adresse complémentaire',
                                            )}
                                        </Label>
                                        <Input
                                            id="address_detail"
                                            name="address_detail"
                                            placeholder={t(
                                                'devenir_agent.form.address_detail_placeholder',
                                                'Repère, rue, secteur...',
                                            )}
                                            className={fieldClasses}
                                        />
                                        <InputError
                                            message={errors.address_detail}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="certifications">
                                        {t(
                                            'devenir_agent.form.certifications',
                                            'Certifications / formations',
                                        )}
                                    </Label>
                                    <Textarea
                                        id="certifications"
                                        name="certifications"
                                        rows={3}
                                        className={fieldClasses}
                                        placeholder={t(
                                            'devenir_agent.form.certifications_placeholder',
                                            'Permis, CQP, formations sécurité...',
                                        )}
                                    />
                                    <InputError
                                        message={errors.certifications}
                                    />
                                </div>
                            </fieldset>
                            <fieldset className="recruitment-v2-fieldset">
                                <legend>
                                    <span>3</span>
                                    {t('recruitment_v2.motivation')}
                                </legend>
                                <div className="grid gap-2">
                                    <Label htmlFor="motivation">
                                        {t(
                                            'devenir_agent.form.motivation',
                                            'Motivation',
                                        )}
                                    </Label>
                                    <Textarea
                                        id="motivation"
                                        name="motivation"
                                        rows={4}
                                        className={fieldClasses}
                                        placeholder={t(
                                            'devenir_agent.form.motivation_placeholder',
                                            'Pourquoi souhaitez-vous rejoindre Super Sécurité ?',
                                        )}
                                    />
                                    <InputError message={errors.motivation} />
                                </div>
                            </fieldset>
                            <label className="flex items-start gap-3 text-sm text-super-securite-muted">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    value="1"
                                    required
                                    className="mt-1 size-4 rounded border-super-securite-border"
                                />
                                <span>
                                    {t(
                                        'devenir_agent.form.consent',
                                        "J'accepte que mes informations soient utilisées par Super Sécurité pour me recontacter dans le cadre du recrutement.",
                                    )}
                                </span>
                            </label>
                            <InputError message={errors.consent} />

                            {recaptcha.enabled && recaptcha.siteKey ? (
                                <div className="grid gap-2">
                                    <RecaptchaField
                                        ref={recaptchaRef}
                                        siteKey={recaptcha.siteKey}
                                        language={recaptcha.language}
                                        onChange={setRecaptchaToken}
                                        onExpired={() => setRecaptchaToken('')}
                                    />
                                    <input
                                        type="hidden"
                                        name="g-recaptcha-response"
                                        value={recaptchaToken}
                                    />
                                    <InputError
                                        message={errors['g-recaptcha-response']}
                                    />
                                </div>
                            ) : null}

                            <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-super-securite-muted">
                                    {t(
                                        'devenir_agent.form.privacy_notice',
                                        'Vos données restent confidentielles et ne sont jamais partagées à des tiers.',
                                    )}
                                </p>
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (recaptcha.enabled && !recaptchaToken)
                                    }
                                    className="marketing-cta-primary marketing-magnetic group inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="size-4" />
                                            {t(
                                                'devenir_agent.form.submitting',
                                                'Envoi en cours...',
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {t(
                                                'devenir_agent.form.submit',
                                                'Envoyer ma candidature',
                                            )}
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
