<?php

namespace App\Services\Marketing;

use App\DataTransferObjects\MarketingContactImportResult;
use App\Models\MarketingContact;
use App\Support\InternationalPhoneNumber;
use App\Support\Marketing\CompanyContactLegacyConverter;
use App\Support\Marketing\MarketingCompanyContactRules;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MarketingContactImportService
{
    /**
     * Importe des contacts depuis un fichier CSV (séparateur auto-détecté , ou ;).
     *
     * Colonnes reconnues : prenom/first_name, nom/last_name, email, telephone/phone/tel,
     * entreprise/company_name, role_entreprise/company_role, contacts_entreprise/company_contacts
     * (JSON plat), adresse/address.
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
            $data['phone'] = InternationalPhoneNumber::normalize($data['phone'] ?? null) ?? $data['phone'];
            $data['company_contacts'] = $this->normalizeImportedCompanyContacts($data['company_contacts'] ?? []);

            $validator = Validator::make($data, [
                'first_name' => ['nullable', 'string', 'max:255'],
                'last_name' => ['nullable', 'string', 'max:255'],
                'email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'regex:/^\+[1-9]\d{1,14}$/'],
                'company_name' => ['nullable', 'string', 'max:255'],
                'address' => ['nullable', 'string', 'max:5000'],
                'marketing_consent' => ['sometimes', 'boolean'],
                ...MarketingCompanyContactRules::rules(),
            ], [
                'email.email' => 'Adresse e-mail invalide.',
                'phone.regex' => 'Le téléphone doit être au format international avec indicatif (ex. +1 (555) 670-8636).',
                ...MarketingCompanyContactRules::messages(),
            ]);

            $validator->after(function ($validation) use ($data): void {
                MarketingCompanyContactRules::validateChannelValues($validation, $data['company_contacts'] ?? []);
            });

            if ($validator->fails()) {
                $result->errors[] = [
                    'row' => $rowNumber,
                    'message' => implode(' ', $validator->errors()->all()),
                ];

                continue;
            }

            $validated = $validator->validated();
            $validated['company_contacts'] = MarketingCompanyContactRules::normalize($validated['company_contacts'] ?? []);

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

            $isCompany = filled($validated['company_name'] ?? null)
                || filled($validated['company_role'] ?? null)
                || ($validated['company_contacts'] ?? []) !== [];

            MarketingContact::query()->create([
                'first_name' => $validated['first_name'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'is_company' => $isCompany,
                'company_name' => $isCompany ? ($validated['company_name'] ?? null) : null,
                'company_role' => $isCompany ? ($validated['company_role'] ?? null) : null,
                'company_contacts' => $isCompany && ($validated['company_contacts'] ?? []) !== []
                    ? $validated['company_contacts']
                    : null,
                'address' => $validated['address'] ?? null,
                'marketing_consent' => (bool) ($validated['marketing_consent'] ?? false),
            ]);

            $result->added++;
        }

        fclose($handle);

        return $result;
    }

    /** @var list<string> */
    public const TEMPLATE_HEADERS = [
        'prenom',
        'nom',
        'email',
        'telephone',
        'entreprise',
        'role_entreprise',
        'contacts_entreprise',
        'adresse',
        'consentement',
    ];

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
            'Aissata',
            'Diallo',
            'aissata@example.com',
            '+224612345678',
            'Super Sécurité Guinée',
            'Directrice commerciale',
            json_encode([
                ['type' => 'email', 'value' => 'compta@example.com', 'label' => 'Compta'],
                ['type' => 'whatsapp', 'value' => '+224600000002', 'label' => null],
            ], JSON_UNESCAPED_UNICODE),
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
                in_array($normalized, ['email', 'e_mail', 'mail'], true) => $map['email'] = $index,
                in_array($normalized, ['telephone', 'phone', 'tel', 'mobile'], true) => $map['phone'] = $index,
                in_array($normalized, ['consentement', 'marketing_consent', 'consent'], true) => $map['marketing_consent'] = $index,
                in_array($normalized, ['entreprise', 'societe', 'company', 'company_name', 'nom_entreprise'], true) => $map['company_name'] = $index,
                in_array($normalized, ['role_entreprise', 'role', 'company_role', 'fonction'], true) => $map['company_role'] = $index,
                in_array($normalized, ['contacts_entreprise', 'company_contacts', 'contacts_societe'], true) => $map['company_contacts'] = $index,
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
            'first_name' => null,
            'last_name' => null,
            'email' => null,
            'phone' => null,
            'company_name' => null,
            'company_role' => null,
            'company_contacts' => [],
            'address' => null,
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
                $data[$field] = $value;

                continue;
            }

            if ($field === 'company_contacts') {
                $decoded = json_decode($value, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $data[$field] = $decoded;
                } else {
                    $data[$field] = CompanyContactLegacyConverter::convert($value);
                }

                continue;
            }

            $data[$field] = $value;
        }

        return $data;
    }

    /**
     * @param  array<int, mixed>  $contacts
     * @return array<int, mixed>
     */
    private function normalizeImportedCompanyContacts(array $contacts): array
    {
        foreach ($contacts as $index => $channel) {
            if (! is_array($channel)) {
                continue;
            }

            $type = (string) ($channel['type'] ?? '');

            if (! in_array($type, ['phone', 'whatsapp'], true)) {
                continue;
            }

            $normalized = InternationalPhoneNumber::normalize($channel['value'] ?? null);

            if ($normalized !== null) {
                $contacts[$index]['value'] = $normalized;
            }
        }

        return $contacts;
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
