<?php

namespace App\Services\Marketing;

use App\DataTransferObjects\MarketingContactImportResult;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Support\InternationalPhoneNumber;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MarketingContactImportService
{
    /** @var list<string> */
    public const TEMPLATE_HEADERS = [
        'nom',
        'email',
        'telephone',
        'groupe',
        'adresse',
        'consentement',
    ];

    /**
     * Importe des contacts depuis un fichier CSV (séparateur auto-détecté , ou ;).
     *
     * Colonnes reconnues : nom (ou prenom + nom), email, telephone/phone/tel,
     * groupe/liste, adresse/address, consentement.
     * Les doublons (e-mail ou téléphone déjà présents) sont ignorés et rapportés.
     * Si un groupe est spécifié et n'existe pas, il est automatiquement créé.
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
            $data['phone'] = InternationalPhoneNumber::normalize($data['phone'] ?? null) ?? $data['phone'];

            $validator = Validator::make($data, [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'regex:/^\+[1-9]\d{1,14}$/'],
                'group_name' => ['nullable', 'string', 'max:255'],
                'address' => ['nullable', 'string', 'max:5000'],
                'marketing_consent' => ['sometimes', 'boolean'],
            ], [
                'name.required' => 'Le nom est obligatoire.',
                'email.email' => 'Adresse e-mail invalide.',
                'phone.regex' => 'Le téléphone doit être au format international avec indicatif (ex. +1 (555) 670-8636 ou +224612345678).',
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

            $contact = MarketingContact::query()->create([
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'is_company' => false,
                'address' => $validated['address'] ?? null,
                'marketing_consent' => (bool) ($validated['marketing_consent'] ?? false),
            ]);

            if (! empty($validated['group_name'])) {
                $groupName = trim((string) $validated['group_name']);

                if ($groupName !== '') {
                    $list = MarketingList::query()->firstOrCreate(
                        ['name' => $groupName],
                        ['description' => 'Créé automatiquement lors de l\'import CSV']
                    );

                    $contact->lists()->syncWithoutDetaching([$list->id]);
                }
            }

            $result->added++;
        }

        fclose($handle);

        return $result;
    }

    /**
     * Contenu CSV du modèle d'import (UTF-8 avec BOM pour Excel).
     */
    public function templateCsv(): string
    {
        $handle = fopen('php://temp', 'r+');

        if ($handle === false) {
            return '';
        }

        fputcsv($handle, self::TEMPLATE_HEADERS);
        fputcsv($handle, [
            'Aissata Diallo',
            'aissata@example.com',
            '+224612345678',
            'Clients VIP',
            'Immeuble Kaloum, Conakry',
            'oui',
        ]);

        rewind($handle);
        $csv = stream_get_contents($handle) ?: '';
        fclose($handle);

        return "\xEF\xBB\xBF".$csv;
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
                in_array($normalized, ['nom_complet', 'full_name', 'name', 'contact'], true) => $map['name'] = $index,
                in_array($normalized, ['email', 'e_mail', 'mail'], true) => $map['email'] = $index,
                in_array($normalized, ['telephone', 'phone', 'tel', 'mobile'], true) => $map['phone'] = $index,
                in_array($normalized, ['groupe', 'group', 'liste', 'list', 'groupe_nom', 'liste_diffusion'], true) => $map['group_name'] = $index,
                in_array($normalized, ['consentement', 'marketing_consent', 'consent'], true) => $map['marketing_consent'] = $index,
                in_array($normalized, ['adresse', 'address'], true) => $map['address'] = $index,
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
            'name' => null,
            'email' => null,
            'phone' => null,
            'group_name' => null,
            'address' => null,
            'marketing_consent' => false,
        ];

        $firstName = null;
        $lastName = null;

        foreach ($columnMap as $field => $index) {
            $value = isset($row[$index]) ? trim((string) $row[$index]) : '';

            if ($value === '') {
                continue;
            }

            if ($field === 'first_name') {
                $firstName = $value;

                continue;
            }

            if ($field === 'last_name') {
                $lastName = $value;

                continue;
            }

            if ($field === 'marketing_consent') {
                $data[$field] = in_array(strtolower($value), ['1', 'true', 'oui', 'yes', 'o'], true);

                continue;
            }

            if ($field === 'phone') {
                $data[$field] = $value;

                continue;
            }

            $data[$field] = $value;
        }

        if (empty($data['name'])) {
            if ($firstName !== null || $lastName !== null) {
                $combined = trim(($firstName ?? '').' '.($lastName ?? ''));
                $data['name'] = $combined !== '' ? $combined : null;
            }
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
