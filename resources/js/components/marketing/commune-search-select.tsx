import { useMemo } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { getCommunesForAgentSelect } from '@/data/guinea-localisation';
import { useTrans } from '@/hooks/use-trans';

type Props = {
    value: string;
    onChange: (communeId: string) => void;
    error?: string;
    fieldClasses?: string;
};

export default function CommuneSearchSelect({
    value,
    onChange,
    error,
    fieldClasses,
}: Props) {
    const { t } = useTrans();
    const options = useMemo(
        () =>
            getCommunesForAgentSelect().map((option) => ({
                value: option.value,
                label: option.label,
            })),
        [],
    );

    return (
        <div className="grid gap-2">
            <Label htmlFor="commune_id">
                {t('devenir_agent.form.commune', 'Commune')}{' '}
                <span className="text-super-securite-accent">*</span>
            </Label>
            <SearchableSelect
                id="commune_id"
                name="commune_id"
                options={options}
                value={value}
                onChange={onChange}
                placeholder={t(
                    'devenir_agent.form.commune_placeholder',
                    'Rechercher une commune...',
                )}
                searchPlaceholder={t(
                    'devenir_agent.form.commune_search_placeholder',
                    'Rechercher une commune...',
                )}
                emptyMessage={t(
                    'devenir_agent.form.commune_empty',
                    'Aucune commune trouvée',
                )}
                required
                variant="underline"
                triggerClassName={fieldClasses}
            />
            <InputError message={error} />
        </div>
    );
}
