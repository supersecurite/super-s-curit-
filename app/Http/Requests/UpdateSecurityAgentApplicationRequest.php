<?php

namespace App\Http\Requests;

use App\Enums\SecurityAgentApplicationStatus;
use App\Models\SecurityAgentApplication;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSecurityAgentApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $application = $this->route('candidatures_agent');

        return $application instanceof SecurityAgentApplication
            && ($this->user()?->can('update', $application) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(SecurityAgentApplicationStatus::class)],
            'internal_notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => bt('validation.status_required'),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'status' => bt('validation.attr_status'),
            'internal_notes' => bt('validation.attr_internal_notes'),
        ];
    }
}
