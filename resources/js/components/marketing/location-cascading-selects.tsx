import { useMemo } from 'react';
import {
    getAllRegions,
    getCommunesForPrefecture,
    getPrefecturesForRegion,
} from '@/data/guinea-localisation';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';

export type LocationValues = {
    region_id: string;
    prefecture_id: string;
    commune_id: string;
};

type LocationCascadingSelectsProps = {
    values: LocationValues;
    onChange: (values: LocationValues) => void;
    errors?: Record<string, string>;
    variant?: 'default' | 'underline';
};

export default function LocationCascadingSelects({
    values,
    onChange,
    errors = {},
    variant = 'default',
}: LocationCascadingSelectsProps) {
    const regions = useMemo(
        () =>
            getAllRegions().map((region) => ({
                value: region.id,
                label: region.nom,
            })),
        [],
    );

    const prefectures = useMemo(() => {
        if (!values.region_id) {
            return [];
        }

        return getPrefecturesForRegion(values.region_id).map((prefecture) => ({
            value: prefecture.id,
            label: prefecture.nom,
        }));
    }, [values.region_id]);

    const communes = useMemo(() => {
        if (!values.prefecture_id) {
            return [];
        }

        return getCommunesForPrefecture(values.prefecture_id).map((commune) => ({
            value: commune.id,
            label: commune.nom,
        }));
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
                <Label
                    htmlFor="region_id"
                    className={
                        variant === 'underline'
                            ? 'text-super-securite-heading'
                            : undefined
                    }
                >
                    Région{' '}
                    <span className="text-super-securite-accent">*</span>
                </Label>
                <SearchableSelect
                    id="region_id"
                    name="region_id"
                    options={regions}
                    value={values.region_id}
                    onChange={handleRegionChange}
                    placeholder="Sélectionner une région"
                    searchPlaceholder="Rechercher une région..."
                    required
                    variant={variant}
                />
                <InputError message={errors.region_id} />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor="prefecture_id"
                    className={
                        variant === 'underline'
                            ? 'text-super-securite-heading'
                            : undefined
                    }
                >
                    Préfecture{' '}
                    <span className="text-super-securite-accent">*</span>
                </Label>
                <SearchableSelect
                    id="prefecture_id"
                    name="prefecture_id"
                    options={prefectures}
                    value={values.prefecture_id}
                    onChange={handlePrefectureChange}
                    placeholder="Sélectionner une préfecture"
                    searchPlaceholder="Rechercher une préfecture..."
                    disabled={!values.region_id}
                    required
                    variant={variant}
                />
                <InputError message={errors.prefecture_id} />
            </div>

            <div className="grid gap-2 sm:col-span-2">
                <Label
                    htmlFor="commune_id"
                    className={
                        variant === 'underline'
                            ? 'text-super-securite-heading'
                            : undefined
                    }
                >
                    Commune
                    {communes.length > 0 ? (
                        <span className="text-super-securite-accent"> *</span>
                    ) : null}
                </Label>
                <SearchableSelect
                    id="commune_id"
                    name="commune_id"
                    options={communes}
                    value={values.commune_id}
                    onChange={(communeId) =>
                        onChange({ ...values, commune_id: communeId })
                    }
                    placeholder={
                        communes.length === 0
                            ? 'Aucune commune disponible'
                            : 'Sélectionner une commune'
                    }
                    searchPlaceholder="Rechercher une commune..."
                    disabled={!values.prefecture_id || communes.length === 0}
                    required={communes.length > 0}
                    variant={variant}
                />
                <InputError message={errors.commune_id} />
            </div>
        </div>
    );
}
