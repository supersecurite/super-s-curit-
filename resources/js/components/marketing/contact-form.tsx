import { Form, Link, usePage } from '@inertiajs/react';
import { useLocalizedUrl } from '@/hooks/use-localized-url';
import { CheckCircle2, Send } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import RecaptchaField, {
    type RecaptchaFieldHandle,
} from '@/components/marketing/recaptcha-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { superSecuriteProjectTypes } from '@/data/super-securite-contact';
import { useTrans } from '@/hooks/use-trans';
import { store } from '@/routes/contact';

type SharedPageProps = {
    flash: { success?: string | null };
    recaptcha: {
        enabled: boolean;
        siteKey: string | null;
        language: string;
    };
};

const fieldClasses =
    'border-super-securite-border bg-super-securite-surface-elevated text-super-securite-heading placeholder:text-super-securite-muted focus-visible:border-super-securite-accent focus-visible:ring-super-securite-accent/30';

export default function ContactForm() {
    const { flash, recaptcha } = usePage<SharedPageProps>().props;
    const { t, tList, locale } = useTrans();
    const lp = useLocalizedUrl();
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const recaptchaRef = useRef<RecaptchaFieldHandle>(null);
    const projectTypes = tList('contact.project_types', [
        ...superSecuriteProjectTypes,
    ]);
    const projectTypeOptions = useMemo(
        () =>
            projectTypes.map((type) => ({
                value: type,
                label: type,
            })),
        [projectTypes],
    );

    return (
        <div className="marketing-card relative overflow-hidden">
            <div
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-super-securite-accent/10 blur-3xl"
                aria-hidden
            />

            <div className="relative">
                <h2 className="font-heading text-2xl font-semibold text-super-securite-heading">
                    {t('contact.form_heading', 'Demander un devis')}
                </h2>
                <p className="mt-2 text-sm text-super-securite-muted">
                    {t('contact_v2.form_intro')}
                </p>

                {flash.success && (
                    <div
                        className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                        role="status"
                    >
                        <CheckCircle2
                            className="mt-0.5 size-5 shrink-0 text-emerald-600"
                            aria-hidden
                        />
                        <span>{flash.success}</span>
                    </div>
                )}

                <Form
                    action={lp(store.url())}
                    method="post"
                    resetOnSuccess
                    onSuccess={() => {
                        setRecaptchaToken('');
                        recaptchaRef.current?.reset();
                    }}
                    className="mt-8 flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-super-securite-heading"
                                    >
                                        {t('contact.form_name', 'Nom complet')}{' '}
                                        <span className="text-super-securite-accent">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        autoComplete="name"
                                        className={fieldClasses}
                                        placeholder={t(
                                            'contact.form_name_placeholder',
                                            'Votre nom complet',
                                        )}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="company"
                                        className="text-super-securite-heading"
                                    >
                                        {t('contact.form_company', 'Société')}
                                    </Label>
                                    <Input
                                        id="company"
                                        name="company"
                                        autoComplete="organization"
                                        className={fieldClasses}
                                        placeholder={t(
                                            'contact.form_company_placeholder',
                                            'Nom de votre société',
                                        )}
                                    />
                                    <InputError message={errors.company} />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="phone"
                                        className="text-super-securite-heading"
                                    >
                                        {t('contact.form_phone', 'Téléphone')}{' '}
                                        <span className="text-super-securite-accent">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        autoComplete="tel"
                                        className={fieldClasses}
                                        placeholder={t(
                                            'contact.form_phone_placeholder',
                                            '+224 ...',
                                        )}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-super-securite-heading"
                                    >
                                        {t('contact.form_email', 'E-mail')}{' '}
                                        <span className="text-super-securite-accent">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className={fieldClasses}
                                        placeholder={t(
                                            'contact.form_email_placeholder',
                                            'vous@email.com',
                                        )}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="project_type"
                                        className="text-super-securite-heading"
                                    >
                                        {t(
                                            'contact.form_project_type',
                                            'Service souhaité',
                                        )}
                                    </Label>
                                    <SearchableSelect
                                        id="project_type"
                                        name="project_type"
                                        options={projectTypeOptions}
                                        placeholder={t(
                                            'contact.form_project_placeholder',
                                            'Sélectionner...',
                                        )}
                                        searchPlaceholder={t(
                                            'contact.form_project_search',
                                            'Rechercher un type...',
                                        )}
                                        variant="underline"
                                        triggerClassName={fieldClasses}
                                    />
                                    <InputError message={errors.project_type} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="site_location"
                                        className="text-super-securite-heading"
                                    >
                                        {t('contact_v2.site_location')}{' '}
                                        <span className="text-super-securite-accent">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="site_location"
                                        name="site_location"
                                        required
                                        autoComplete="off"
                                        className={fieldClasses}
                                        placeholder={t(
                                            'contact_v2.site_location_placeholder',
                                        )}
                                    />
                                    <InputError
                                        message={errors.site_location}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="message"
                                    className="text-super-securite-heading"
                                >
                                    {t('contact.form_message', 'Message')}{' '}
                                    <span className="text-super-securite-accent">
                                        *
                                    </span>
                                </Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    className={fieldClasses}
                                    placeholder={t(
                                        'contact.form_message_placeholder',
                                        'Décrivez vos besoins en quelques lignes…',
                                    )}
                                />
                                <InputError message={errors.message} />
                            </div>

                            {recaptcha.enabled && recaptcha.siteKey ? (
                                <div className="grid gap-2">
                                    <RecaptchaField
                                        ref={recaptchaRef}
                                        siteKey={recaptcha.siteKey}
                                        language={
                                            locale === 'zh' ? 'zh-CN' : locale
                                        }
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

                            <label className="contact-v2-consent flex items-start gap-3 text-sm text-super-securite-muted">
                                <input
                                    type="checkbox"
                                    name="privacy_consent"
                                    value="1"
                                    required
                                    className="mt-1 size-4 rounded border-super-securite-border"
                                />
                                <span>
                                    {t('contact_v2.consent')}{' '}
                                    <Link
                                        href={lp(
                                            '/politique-de-confidentialite',
                                        )}
                                    >
                                        {t('footer_v2.privacy')}
                                    </Link>
                                </span>
                            </label>
                            <InputError message={errors.privacy_consent} />

                            <div className="pt-1">
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (recaptcha.enabled && !recaptchaToken)
                                    }
                                    className="marketing-cta-primary marketing-magnetic group inline-flex w-full items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="size-4" />
                                            {t(
                                                'contact.form_submitting',
                                                'Envoi en cours...',
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {t(
                                                'contact.form_submit',
                                                'Envoyer',
                                            )}
                                            <Send
                                                className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
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
