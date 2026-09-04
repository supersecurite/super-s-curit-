<?php

namespace App\Support\Marketing;

use App\Enums\MarketingCompanyContactChannel;
use App\Support\InternationalPhoneNumber;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validation et normalisation du JSON `company_contacts` (canaux entreprise plats).
 */
final class MarketingCompanyContactRules
{
    /**
     * @return array<string, mixed>
     */
    public static function rules(): array
    {
        return [
            'company_contacts' => ['nullable', 'array', 'max:30'],
            'company_contacts.*.type' => [
                'required',
                'string',
                Rule::enum(MarketingCompanyContactChannel::class),
            ],
            'company_contacts.*.value' => ['required', 'string', 'max:255'],
            'company_contacts.*.label' => ['nullable', 'string', 'max:100'],
        ];
    }

    public static function prepareForValidation(FormRequest $request): void
    {
        if (! $request->has('company_contacts')) {
            return;
        }

        $value = $request->input('company_contacts');

        if (is_string($value)) {
            $trimmed = trim($value);

            if ($trimmed === '') {
                $request->merge(['company_contacts' => []]);

                return;
            }

            $decoded = json_decode($trimmed, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $request->merge(['company_contacts' => $decoded]);

                return;
            }

            $request->merge(['company_contacts' => []]);

            return;
        }

        if ($value === null) {
            $request->merge(['company_contacts' => []]);
        }
    }

    /**
     * Normalise les numéros phone/whatsapp dans company_contacts avant validation.
     */
    public static function normalizePhoneFields(FormRequest $request): void
    {
        if (! $request->has('company_contacts') || ! is_array($request->input('company_contacts'))) {
            return;
        }

        $contacts = $request->input('company_contacts');

        foreach ($contacts as $index => $channel) {
            if (! is_array($channel)) {
                continue;
            }

            $type = MarketingCompanyContactChannel::tryFrom((string) ($channel['type'] ?? ''));

            if (! in_array($type, [MarketingCompanyContactChannel::Phone, MarketingCompanyContactChannel::WhatsApp], true)) {
                continue;
            }

            $normalized = InternationalPhoneNumber::normalize($channel['value'] ?? null);

            if ($normalized !== null) {
                $contacts[$index]['value'] = $normalized;
            }
        }

        $request->merge(['company_contacts' => $contacts]);
    }

    /**
     * @param  array<int, mixed>|null  $contacts
     * @return list<array{type: string, value: string, label: ?string}>
     */
    public static function normalize(?array $contacts): array
    {
        if ($contacts === null || $contacts === []) {
            return [];
        }

        if (self::isLegacyPersonFormat($contacts)) {
            return self::flattenLegacyPersons($contacts);
        }

        $normalized = [];

        foreach ($contacts as $channel) {
            if (! is_array($channel)) {
                continue;
            }

            $parsed = self::parseChannel($channel);

            if ($parsed !== null) {
                $normalized[] = $parsed;
            }
        }

        return $normalized;
    }

    /**
     * @param  array<int, mixed>|null  $contacts
     */
    public static function extractLegacyRole(?array $contacts): ?string
    {
        if ($contacts === null || ! self::isLegacyPersonFormat($contacts)) {
            return null;
        }

        foreach ($contacts as $person) {
            if (! is_array($person)) {
                continue;
            }

            $role = trim((string) ($person['role'] ?? ''));

            if ($role !== '') {
                return $role;
            }
        }

        return null;
    }

    /**
     * @return array<string, string>
     */
    public static function messages(): array
    {
        return [
            'company_contacts.*.type' => 'Le type de canal est invalide (email, phone, whatsapp).',
            'company_contacts.*.value.required' => 'La valeur du canal est requise.',
        ];
    }

    public static function validateChannelValues(Validator $validator, mixed $contacts): void
    {
        if (! is_array($contacts)) {
            return;
        }

        $channels = self::isLegacyPersonFormat($contacts)
            ? self::flattenLegacyPersons($contacts)
            : $contacts;

        foreach ($channels as $channelIndex => $channel) {
            if (! is_array($channel)) {
                continue;
            }

            $type = MarketingCompanyContactChannel::tryFrom((string) ($channel['type'] ?? ''));
            $value = trim((string) ($channel['value'] ?? ''));

            if ($type === null || $value === '') {
                continue;
            }

            $field = "company_contacts.{$channelIndex}.value";

            if ($type === MarketingCompanyContactChannel::Email && ! filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $validator->errors()->add($field, 'Adresse e-mail invalide.');

                continue;
            }

            if (
                in_array($type, [MarketingCompanyContactChannel::Phone, MarketingCompanyContactChannel::WhatsApp], true)
                && ! InternationalPhoneNumber::isValid($value)
            ) {
                $validator->errors()->add($field, 'Le numéro doit être au format international avec indicatif (ex. +1 (555) 670-8636).');
            }
        }
    }

    /**
     * @param  array<int, mixed>  $contacts
     */
    private static function isLegacyPersonFormat(array $contacts): bool
    {
        $first = $contacts[0] ?? null;

        return is_array($first) && array_key_exists('channels', $first);
    }

    /**
     * @param  array<int, mixed>  $persons
     * @return list<array{type: string, value: string, label: ?string}>
     */
    private static function flattenLegacyPersons(array $persons): array
    {
        $channels = [];

        foreach ($persons as $person) {
            if (! is_array($person)) {
                continue;
            }

            foreach ($person['channels'] ?? [] as $channel) {
                if (! is_array($channel)) {
                    continue;
                }

                $parsed = self::parseChannel($channel);

                if ($parsed !== null) {
                    $channels[] = $parsed;
                }
            }
        }

        return $channels;
    }

    /**
     * @param  array<string, mixed>  $channel
     * @return array{type: string, value: string, label: ?string}|null
     */
    private static function parseChannel(array $channel): ?array
    {
        $type = MarketingCompanyContactChannel::tryFrom((string) ($channel['type'] ?? ''));

        if ($type === null) {
            return null;
        }

        $value = trim((string) ($channel['value'] ?? ''));

        if ($value === '') {
            return null;
        }

        if (in_array($type, [MarketingCompanyContactChannel::Phone, MarketingCompanyContactChannel::WhatsApp], true)) {
            $value = InternationalPhoneNumber::normalize($value) ?? $value;
        }

        return [
            'type' => $type->value,
            'value' => $value,
            'label' => filled($channel['label'] ?? null)
                ? trim((string) $channel['label'])
                : null,
        ];
    }
}
