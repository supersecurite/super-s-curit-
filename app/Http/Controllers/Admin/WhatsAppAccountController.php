<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\CreateWhatsAppAccount;
use App\Actions\Marketing\DeleteWhatsAppAccount;
use App\Actions\Marketing\UpdateWhatsAppAccount;
use App\Enums\WhatsAppAccountDriver;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWhatsAppAccountRequest;
use App\Http\Requests\UpdateWhatsAppAccountRequest;
use App\Models\WhatsAppAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WhatsAppAccountController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', WhatsAppAccount::class);

        $accounts = WhatsAppAccount::query()
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get()
            ->map(fn (WhatsAppAccount $account) => [
                ...$account->toAdminArray(),
                'can_update' => $request->user()?->can('update', $account) ?? false,
                'can_delete' => $request->user()?->can('delete', $account) ?? false,
            ]);

        return Inertia::render('marketing-whatsapp-accounts/index', [
            'accounts' => $accounts,
            'canCreate' => $request->user()?->can('create', WhatsAppAccount::class) ?? false,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', WhatsAppAccount::class);

        return Inertia::render('marketing-whatsapp-accounts/create', [
            'drivers' => $this->driverOptions(),
        ]);
    }

    public function store(StoreWhatsAppAccountRequest $request, CreateWhatsAppAccount $action): RedirectResponse
    {
        $account = $action->handle($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Compte WhatsApp créé avec succès.']);

        return to_route('marketing-whatsapp-accounts.edit', $account);
    }

    public function edit(Request $request, WhatsAppAccount $whatsapp_account): Response
    {
        $this->authorize('update', $whatsapp_account);

        return Inertia::render('marketing-whatsapp-accounts/edit', [
            'account' => $whatsapp_account->toAdminArray(includeWebhookUrl: true),
            'drivers' => $this->driverOptions(),
            'canDelete' => $request->user()?->can('delete', $whatsapp_account) ?? false,
        ]);
    }

    public function update(
        UpdateWhatsAppAccountRequest $request,
        WhatsAppAccount $whatsapp_account,
        UpdateWhatsAppAccount $action,
    ): RedirectResponse {
        $action->handle($whatsapp_account, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Compte WhatsApp mis à jour.']);

        return to_route('marketing-whatsapp-accounts.edit', $whatsapp_account);
    }

    public function destroy(WhatsAppAccount $whatsapp_account, DeleteWhatsAppAccount $action): RedirectResponse
    {
        $this->authorize('delete', $whatsapp_account);

        $action->handle($whatsapp_account);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Compte WhatsApp supprimé.']);

        return to_route('marketing-whatsapp-accounts.index');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function driverOptions(): array
    {
        return collect(WhatsAppAccountDriver::cases())
            ->map(fn (WhatsAppAccountDriver $driver) => [
                'value' => $driver->value,
                'label' => $driver->label(),
            ])
            ->values()
            ->all();
    }
}
