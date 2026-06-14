import { Form, usePage } from '@inertiajs/react';
import { CheckCircle2, ChevronDown, Send } from 'lucide-react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { superSecuriteProjectTypes } from '@/data/super-securite-contact';
import { store } from '@/routes/contact';
import { cn } from '@/lib/utils';

type SharedPageProps = {
    flash: { success?: string | null };
};

const fieldClasses =
    'border-super-securite-border bg-super-securite-surface-elevated text-super-securite-heading placeholder:text-super-securite-muted focus-visible:border-super-securite-accent focus-visible:ring-super-securite-accent/30';

export default function ContactForm() {
    const { flash } = usePage<SharedPageProps>().props;

    return (
        <div className="marketing-card relative overflow-hidden">
            <div
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-super-securite-accent/10 blur-3xl"
                aria-hidden
            />

            <div className="relative">
                <p className="marketing-label mb-2">Formulaire de contact</p>
                <h2 className="font-heading text-2xl font-semibold text-super-securite-heading">
                    Décrivez votre besoin de sécurité
                </h2>
                <p className="mt-2 text-sm text-super-securite-muted">
                    Les champs marqués d&apos;un{' '}
                    <span className="text-super-securite-accent">*</span> sont
                    obligatoires.
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
                    {...store.form()}
                    resetOnSuccess
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
                                        Nom complet{' '}
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
                                        placeholder="Votre nom"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-super-securite-heading"
                                    >
                                        E-mail{' '}
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
                                        placeholder="vous@exemple.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="phone"
                                        className="text-super-securite-heading"
                                    >
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
                                        autoComplete="tel"
                                        className={fieldClasses}
                                        placeholder="+224 ..."
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="company"
                                        className="text-super-securite-heading"
                                    >
                                        Entreprise{' '}
                                        <span className="text-super-securite-muted">
                                            (optionnel)
                                        </span>
                                    </Label>
                                    <Input
                                        id="company"
                                        name="company"
                                        autoComplete="organization"
                                        className={fieldClasses}
                                        placeholder="Nom de votre entreprise"
                                    />
                                    <InputError message={errors.company} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="project_type"
                                    className="text-super-securite-heading"
                                >
                                    Type de projet
                                </Label>
                                <div className="relative">
                                    <select
                                        id="project_type"
                                        name="project_type"
                                        defaultValue=""
                                        className={cn(
                                            fieldClasses,
                                            'h-9 w-full appearance-none rounded-md border bg-super-securite-surface-elevated px-3 pr-9 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-none disabled:opacity-50',
                                        )}
                                    >
                                        <option value="">
                                            Sélectionner...
                                        </option>
                                        {superSecuriteProjectTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-super-securite-muted"
                                        aria-hidden
                                    />
                                </div>
                                <InputError message={errors.project_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="message"
                                    className="text-super-securite-heading"
                                >
                                    Détails du projet{' '}
                                    <span className="text-super-securite-accent">
                                        *
                                    </span>
                                </Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    className={fieldClasses}
                                    placeholder="Décrivez votre projet : objectifs, contexte, délais souhaités..."
                                />
                                <InputError message={errors.message} />
                            </div>

                            <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-super-securite-muted">
                                    Vos informations restent confidentielles et
                                    ne sont jamais partagées.
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
                                            Envoyer
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
