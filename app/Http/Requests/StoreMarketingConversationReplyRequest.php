<?php

namespace App\Http\Requests;

use App\Models\MarketingConversation;
use Illuminate\Foundation\Http\FormRequest;

class StoreMarketingConversationReplyRequest extends FormRequest
{
    public function authorize(): bool
    {
        $conversation = $this->route('marketing_conversation');

        return $conversation instanceof MarketingConversation
            && $this->user()?->can('reply', $conversation) === true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:20000'],
            'subject' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'body.required' => 'Le message est obligatoire.',
        ];
    }
}
