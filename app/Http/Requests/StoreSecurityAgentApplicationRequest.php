<?php

namespace App\Http\Requests;

use App\Enums\SecurityAgentPost;
use App\Rules\Recaptcha;
use App\Support\GuineaLocationValidator;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreSecurityAgentApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'availability' => ['nullable', 'string', Rule::in(['jour', 'nuit', '24h', 'evenementiel'])],
            'certifications' => ['nullable', 'string', 'max:2000'],
            'motivation' => ['nullable', 'string', 'max:5000'],
            'post' => ['required', 'string', Rule::enum(SecurityAgentPost::class)],
            'commune_id' => ['required', 'string', 'max:20'],
            'address_detail' => ['nullable', 'string', 'max:500'],
            'consent' => ['accepted'],
            'website' => ['nullable', 'max:0'],
            'g-recaptcha-response' => [
                Rule::requiredIf(fn (): bool => (bool) config('recaptcha.enabled')),
                new Recaptcha,
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        app(GuineaLocationValidator::class)->attachToValidator($validator);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'first_name.required' => __('devenir_agent.validation.first_name_required'),
            'last_name.required' => __('devenir_agent.validation.last_name_required'),
            'phone.required' => __('devenir_agent.validation.phone_required'),
            'email.email' => __('devenir_agent.validation.email_invalid'),
            'consent.accepted' => __('devenir_agent.validation.consent_required'),
            'post.required' => __('devenir_agent.validation.post_required'),
            'g-recaptcha-response' => __('devenir_agent.validation.recaptcha_required'),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'first_name' => __('devenir_agent.form.first_name'),
            'last_name' => __('devenir_agent.form.last_name'),
            'phone' => __('devenir_agent.form.phone'),
            'email' => __('devenir_agent.form.email'),
            'experience_years' => __('devenir_agent.form.experience_years'),
            'availability' => __('devenir_agent.form.availability'),
            'certifications' => __('devenir_agent.form.certifications'),
            'motivation' => __('devenir_agent.form.motivation'),
            'post' => __('devenir_agent.form.post'),
            'commune_id' => __('devenir_agent.form.commune'),
            'address_detail' => __('devenir_agent.form.address_detail'),
            'consent' => __('devenir_agent.form.consent'),
            'g-recaptcha-response' => __('devenir_agent.validation.recaptcha_required'),
        ];
    }
}
