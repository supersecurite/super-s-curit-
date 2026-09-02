<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Marketing\CreateMarketingEmailAccount;
use App\Actions\Marketing\DeleteMarketingEmailAccount;
use App\Actions\Marketing\UpdateMarketingEmailAccount;
use App\Enums\MarketingEmailAccountDriver;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketingEmailAccountRequest;
use App\Http\Requests\UpdateMarketingEmailAccountRequest;
use App\Models\MarketingEmailAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketingEmailAccountController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MarketingEmailAccount::class);

        $accounts = MarketingEmailAccount::query()
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get()
            ->map(fn (MarketingEmailAccount $account) => [
                ...$account->toAdminArray(),
                'can_update' => $request->user()?->can('update', $account) ?? false,
                'can_delete' => $request->user()?->can('delete', $account) ?? false,
            ]);

        return Inertia::render('marketing-email-accounts/index', [
            'accounts' => $accounts,
            'canCreate' => $request->user()?->can('create', MarketingEmailAccount::class) ?? false,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', MarketingEmailAccount::class);

        return Inertia::render('marketing-email-accounts/create', [
            'drivers' => $this->driverOptions(),
        ]);
    }

    public function store(
        StoreMarketingEmailAccountRequest $request,
        CreateMarketingEmailAccount $action,
    ): RedirectResponse {
        $account = $action->handle($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Compte e-mail créé avec succès.']);

        return to_route('marketing-email-accounts.edit', $account);
    }

    public function edit(Request $request, MarketingEmailAccount $marketing_email_account): Response
    {
        $this->authorize('update', $marketing_email_account);

        return Inertia::render('marketing-email-accounts/edit', [
            'account' => $marketing_email_account->toAdminArray(),
            'drivers' => $this->driverOptions(),
            'canDelete' => $request->user()?->can('delete', $marketing_email_account) ?? false,
        ]);
    }

    public function update(
        UpdateMarketingEmailAccountRequest $request,
        MarketingEmailAccount $marketing_email_account,
        UpdateMarketingEmailAccount $action,
    ): RedirectResponse {
        $action->handle($marketing_email_account, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Compte e-mail mis à jour.']);

        return to_route('marketing-email-accounts.edit', $marketing_email_account);
    }

    public function destroy(
        MarketingEmailAccount $marketing_email_account,
        DeleteMarketingEmailAccount $action,
    ): RedirectResponse {
        $this->authorize('delete', $marketing_email_account);

        $action->handle($marketing_email_account);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Compte e-mail supprimé.']);

        return to_route('marketing-email-accounts.index');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function driverOptions(): array
    {
        return collect(MarketingEmailAccountDriver::cases())
            ->map(fn (MarketingEmailAccountDriver $driver) => [
                'value' => $driver->value,
                'label' => $driver->label(),
            ])
            ->values()
            ->all();
    }
}
