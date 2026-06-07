import { useMemo } from 'react';
import {
    getAllRegions,
    getCommunesForPrefecture,
    getPrefecturesForRegion,
} from '@/data/guinea-localisation';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type LocationValues = {
    region_id: string;
    prefecture_id: string;
    commune_id: string;
};

type LocationCascadingSelectsProps = {
    values: LocationValues;
    onChange: (values: LocationValues) => void;
    errors?: Record<string, string>;
    fieldClassName?: string;
};

const defaultFieldClasses =
    'border-super-securite-border bg-super-securite-surface-elevated text-super-securite-heading focus:ring-super-securite-accent/30 h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

export default function LocationCascadingSelects({
    values,
    onChange,
    errors = {},
    fieldClassName = defaultFieldClasses,
}: LocationCascadingSelectsProps) {
    const regions = useMemo(() => getAllRegions(), []);

    const prefectures = useMemo(() => {
        if (!values.region_id) {
            return [];
        }

        return getPrefecturesForRegion(values.region_id);
    }, [values.region_id]);

    const communes = useMemo(() => {
        if (!values.prefecture_id) {
            return [];
        }

        return getCommunesForPrefecture(values.prefecture_id);
    }, [values.prefecture_id]);

    const handleRegionChange = (regionId: string) => {
        onChange({
            region_id: regionId,
            prefecture_id: '',
            commune_id: '',
        });
    };

    const handlePrefectureChange = (prefectureId: string) => {
        onChange({
            ...values,
            prefecture_id: prefectureId,
            commune_id: '',
        });
    };

    return (
        <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="region_id" className="text-super-securite-heading">
                    Région <span className="text-super-securite-accent">*</span>
                </Label>
                <select
                    id="region_id"
                    name="region_id"
                    required
                    value={values.region_id}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className={cn(fieldClassName)}
                >
                    <option value="">Sélectionner une région</option>
                    {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                            {region.nom}
                        </option>
                    ))}
                </select>
                <InputError message={errors.region_id} />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor="prefecture_id"
                    className="text-super-securite-heading"
                >
                    Préfecture{' '}
                    <span className="text-super-securite-accent">*</span>
                </Label>
                <select
                    id="prefecture_id"
                    name="prefecture_id"
                    required
                    value={values.prefecture_id}
                    onChange={(e) => handlePrefectureChange(e.target.value)}
                    disabled={!values.region_id}
                    className={cn(fieldClassName)}
                >
                    <option value="">Sélectionner une préfecture</option>
                    {prefectures.map((prefecture) => (
                        <option key={prefecture.id} value={prefecture.id}>
                            {prefecture.nom}
                        </option>
                    ))}
                </select>
                <InputError message={errors.prefecture_id} />
            </div>

            <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="commune_id" className="text-super-securite-heading">
                    Commune
                    {communes.length > 0 ? (
                        <span className="text-super-securite-accent"> *</span>
                    ) : null}
                </Label>
                <select
                    id="commune_id"
                    name="commune_id"
                    value={values.commune_id}
                    onChange={(e) =>
                        onChange({ ...values, commune_id: e.target.value })
                    }
                    disabled={!values.prefecture_id || communes.length === 0}
                    required={communes.length > 0}
                    className={cn(fieldClassName)}
                >
                    <option value="">
                        {communes.length === 0
                            ? 'Aucune commune disponible'
                            : 'Sélectionner une commune'}
                    </option>
                    {communes.map((commune) => (
                        <option key={commune.id} value={commune.id}>
                            {commune.nom}
                        </option>
                    ))}
                </select>
                <InputError message={errors.commune_id} />
            </div>
        </div>
    );
}
