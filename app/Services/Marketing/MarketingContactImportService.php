<?php

namespace App\Services\Marketing;

use App\DataTransferObjects\MarketingContactImportResult;
use App\Models\MarketingContact;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MarketingContactImportService
{
    /**
     * Importe des contacts depuis un fichier CSV (séparateur auto-détecté , ou ;).
     *
     * Colonnes reconnues : prenom/first_name, nom/last_name, email, telephone/phone/tel.
     * Les doublons (e-mail ou téléphone déjà présents) sont ignorés et rapportés.
     */
    public function import(UploadedFile $file): MarketingContactImportResult
    {
        $result = new MarketingContactImportResult;
        $handle = fopen($file->getRealPath(), 'r');

        if ($handle === false) {
            $result->errors[] = ['row' => 0, 'message' => 'Impossible de lire le fichier CSV.'];

            return $result;
        }

        $firstLine = fgets($handle);

        if ($firstLine === false) {
            fclose($handle);
            $result->errors[] = ['row' => 0, 'message' => 'Le fichier CSV est vide.'];

            return $result;
        }

        $delimiter = substr_count($firstLine, ';') > substr_count($firstLine, ',') ? ';' : ',';
        rewind($handle);

        $headers = fgetcsv($handle, 0, $delimiter);

        if ($headers === false) {
            fclose($handle);
            $result->errors[] = ['row' => 0, 'message' => 'En-têtes CSV introuvables.'];

            return $result;
        }

        $columnMap = $this->mapHeaders($headers);
        $rowNumber = 1;

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;

            if ($this->isEmptyRow($row)) {
                continue;
            }

            $data = $this->extractRowData($row, $columnMap);

            $validator = Validator::make($data, [
                'first_name' => ['nullable', 'string', 'max:255'],
                'last_name' => ['nullable', 'string', 'max:255'],
                'email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'regex:/^\+[1-9]\d{1,14}$/'],
                'marketing_consent' => ['sometimes', 'boolean'],
            ], [
                'email.email' => 'Adresse e-mail invalide.',
                'phone.regex' => 'Le téléphone doit être au format E.164 (ex. +224612345678).',
            ]);

            if ($validator->fails()) {
                $result->errors[] = [
                    'row' => $rowNumber,
                    'message' => implode(' ', $validator->errors()->all()),
                ];

                continue;
            }

            $validated = $validator->validated();

            if (empty($validated['email']) && empty($validated['phone'])) {
                $result->errors[] = [
                    'row' => $rowNumber,
                    'message' => 'Au moins un e-mail ou un téléphone est requis.',
                ];

                continue;
            }

            $duplicate = $this->findDuplicate($validated['email'] ?? null, $validated['phone'] ?? null);

            if ($duplicate !== null) {
                $result->skipped++;
                $result->duplicates[] = [
                    'row' => $rowNumber,
                    'email' => $validated['email'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                ];

                continue;
            }

            MarketingContact::query()->create([
                'first_name' => $validated['first_name'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'marketing_consent' => (bool) ($validated['marketing_consent'] ?? false),
            ]);

            $result->added++;
        }

        fclose($handle);

        return $result;
    }

    /**
     * @param  list<string|null>  $headers
     * @return array<string, int>
     */
    private function mapHeaders(array $headers): array
    {
        $map = [];

        foreach ($headers as $index => $header) {
            $normalized = Str::of((string) $header)
                ->lower()
                ->ascii()
                ->replace([' ', '-'], '_')
                ->trim('_')
                ->toString();

            match (true) {
                in_array($normalized, ['prenom', 'first_name', 'firstname'], true) => $map['first_name'] = $index,
                in_array($normalized, ['nom', 'last_name', 'lastname'], true) => $map['last_name'] = $index,
                in_array($normalized, ['email', 'e_mail', 'mail'], true) => $map['email'] = $index,
                in_array($normalized, ['telephone', 'phone', 'tel', 'mobile'], true) => $map['phone'] = $index,
                in_array($normalized, ['consentement', 'marketing_consent', 'consent'], true) => $map['marketing_consent'] = $index,
                default => null,
            };
        }

        return $map;
    }

    /**
     * @param  list<string|null>  $row
     * @param  array<string, int>  $columnMap
     * @return array<string, mixed>
     */
    private function extractRowData(array $row, array $columnMap): array
    {
        $data = [
            'first_name' => null,
            'last_name' => null,
            'email' => null,
            'phone' => null,
            'marketing_consent' => false,
        ];

        foreach ($columnMap as $field => $index) {
            $value = isset($row[$index]) ? trim((string) $row[$index]) : '';

            if ($value === '') {
                continue;
            }

            if ($field === 'marketing_consent') {
                $data[$field] = in_array(strtolower($value), ['1', 'true', 'oui', 'yes', 'o'], true);

                continue;
            }

            if ($field === 'phone') {
                $data[$field] = str_starts_with($value, '+') ? $value : '+'.$value;

                continue;
            }

            $data[$field] = $value;
        }

        return $data;
    }

    /**
     * @param  list<string|null>  $row
     */
    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $cell) {
            if (trim((string) $cell) !== '') {
                return false;
            }
        }

        return true;
    }

    private function findDuplicate(?string $email, ?string $phone): ?MarketingContact
    {
        if (($email === null || $email === '') && ($phone === null || $phone === '')) {
            return null;
        }

        return MarketingContact::query()
            ->where(function ($query) use ($email, $phone): void {
                if ($email !== null && $email !== '') {
                    $query->orWhere('email', $email);
                }

                if ($phone !== null && $phone !== '') {
                    $query->orWhere('phone', $phone);
                }
            })
            ->first();
    }
}
