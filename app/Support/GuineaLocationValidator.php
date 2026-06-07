<?php

namespace App\Support;

use Illuminate\Validation\Validator;

class GuineaLocationValidator
{
    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    public function validate(array $data): array
    {
        $errors = [];

        $regionId = (string) ($data['region_id'] ?? '');
        $prefectureId = (string) ($data['prefecture_id'] ?? '');
        $communeId = (string) ($data['commune_id'] ?? '');

        if ($regionId === '') {
            $errors['region_id'] = 'La région est obligatoire.';

            return $errors;
        }

        $region = GuineaLocationData::findRegion($regionId);
        if ($region === null) {
            $errors['region_id'] = 'La région sélectionnée est invalide.';

            return $errors;
        }

        if ($prefectureId === '') {
            $errors['prefecture_id'] = 'La préfecture est obligatoire.';

            return $errors;
        }

        $prefecture = GuineaLocationData::findPrefecture($prefectureId);
        if ($prefecture === null) {
            $errors['prefecture_id'] = 'La préfecture sélectionnée est invalide.';

            return $errors;
        }

        if (($prefecture['regionId'] ?? null) !== $regionId) {
            $errors['prefecture_id'] = 'La préfecture ne correspond pas à la région sélectionnée.';
        }

        $communes = GuineaLocationData::communesForPrefecture($prefectureId);

        if ($communes !== [] && $communeId === '') {
            $errors['commune_id'] = 'La commune est obligatoire pour cette préfecture.';
        }

        if ($communeId !== '') {
            $commune = GuineaLocationData::findCommune($communeId);

            if ($commune === null) {
                $errors['commune_id'] = 'La commune sélectionnée est invalide.';
            } elseif (($commune['prefectureId'] ?? null) !== $prefectureId) {
                $errors['commune_id'] = 'La commune ne correspond pas à la préfecture sélectionnée.';
            }
        }

        return $errors;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string|null>
     */
    public function resolveLabels(array $data): array
    {
        $region = GuineaLocationData::findRegion((string) ($data['region_id'] ?? ''));
        $prefecture = GuineaLocationData::findPrefecture((string) ($data['prefecture_id'] ?? ''));
        $commune = ($data['commune_id'] ?? '') !== ''
            ? GuineaLocationData::findCommune((string) $data['commune_id'])
            : null;

        return [
            'region_name' => $region['nom'] ?? null,
            'prefecture_name' => $prefecture['nom'] ?? null,
            'commune_name' => $commune['nom'] ?? null,
            'quartier_name' => null,
            'quartier_id' => null,
        ];
    }

    public function attachToValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            foreach ($this->validate($validator->getData()) as $field => $message) {
                $validator->errors()->add($field, $message);
            }
        });
    }
}
