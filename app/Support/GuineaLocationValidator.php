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

        $communeId = (string) ($data['commune_id'] ?? '');

        if ($communeId === '') {
            $errors['commune_id'] = 'La commune est obligatoire.';

            return $errors;
        }

        if (GuineaLocationData::findCommune($communeId) === null) {
            $errors['commune_id'] = 'La commune sélectionnée est invalide.';
        }

        return $errors;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function enrichFromCommune(array $data): array
    {
        $communeId = (string) ($data['commune_id'] ?? '');

        if ($communeId === '') {
            return $data;
        }

        $commune = GuineaLocationData::findCommune($communeId);

        if ($commune === null) {
            return $data;
        }

        $data['region_id'] = (string) ($commune['regionId'] ?? '');
        $data['prefecture_id'] = (string) ($commune['prefectureId'] ?? '');

        return $data;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string|null>
     */
    public function resolveLabels(array $data): array
    {
        $commune = ($data['commune_id'] ?? '') !== ''
            ? GuineaLocationData::findCommune((string) $data['commune_id'])
            : null;

        if ($commune === null) {
            return [
                'region_name' => null,
                'prefecture_name' => null,
                'commune_name' => null,
                'quartier_name' => null,
                'quartier_id' => null,
            ];
        }

        $prefecture = GuineaLocationData::findPrefecture((string) ($commune['prefectureId'] ?? ''));
        $region = GuineaLocationData::findRegion((string) ($commune['regionId'] ?? ''));

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
