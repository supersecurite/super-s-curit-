<?php

namespace App\Http\Controllers\Admin;

use App\Actions\JobOffers\CreateJobOffer;
use App\Actions\JobOffers\DeleteJobOffer;
use App\Actions\JobOffers\ToggleJobOfferActive;
use App\Actions\JobOffers\UpdateJobOffer;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobOfferRequest;
use App\Http\Requests\UpdateJobOfferRequest;
use App\Models\JobOffer;
use App\Support\IndexTableSort;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobOfferController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', JobOffer::class);

        $query = JobOffer::query()->withCount('applications');

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('title', 'like', '%'.$search.'%')
                    ->orWhere('location', 'like', '%'.$search.'%')
                    ->orWhere('contract_type', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('status') && $request->string('status')->toString() !== 'all') {
            $query->where('is_active', $request->string('status')->toString() === 'active');
        }

        $sort = IndexTableSort::resolve(
            $request,
            ['title', 'location', 'contract_type', 'is_active', 'applications_count', 'updated_at'],
            'updated_at',
            'desc',
        );

        if ($sort['column'] === 'applications_count') {
            $query->orderBy('applications_count', $sort['direction']);
        } else {
            $query->orderBy($sort['column'], $sort['direction']);
        }

        $offers = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn (JobOffer $offer) => [
                ...$offer->toAdminArray(),
                'can_update' => $request->user()?->can('update', $offer) ?? false,
                'can_delete' => $request->user()?->can('delete', $offer) ?? false,
            ]);

        return Inertia::render('offres-emploi/index', [
            'offers' => $offers,
            'filters' => [
                ...$request->only(['search', 'status']),
                ...IndexTableSort::filters($request),
            ],
            'canCreate' => $request->user()?->can('create', JobOffer::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', JobOffer::class);

        return Inertia::render('offres-emploi/create');
    }

    public function store(StoreJobOfferRequest $request, CreateJobOffer $action): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', true);

        $action->handle($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => bt('toasts.job_offer_created'),
        ]);

        return to_route('offres-emploi.index');
    }

    public function show(JobOffer $offres_emploi): RedirectResponse
    {
        $this->authorize('view', $offres_emploi);

        return redirect()->route('offres-emploi.edit', $offres_emploi);
    }

    public function edit(JobOffer $offres_emploi): Response
    {
        $this->authorize('update', $offres_emploi);

        return Inertia::render('offres-emploi/edit', [
            'offer' => $offres_emploi->loadCount('applications')->toAdminArray(),
        ]);
    }

    public function update(
        UpdateJobOfferRequest $request,
        JobOffer $offres_emploi,
        UpdateJobOffer $action,
    ): RedirectResponse {
        $validated = $request->validated();
        $validated['is_active'] = $request->boolean('is_active', $offres_emploi->is_active);

        $action->handle($offres_emploi, $validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => bt('toasts.job_offer_updated'),
        ]);

        return to_route('offres-emploi.index');
    }

    public function toggle(
        Request $request,
        JobOffer $offres_emploi,
        ToggleJobOfferActive $action,
    ): RedirectResponse {
        $this->authorize('update', $offres_emploi);

        $active = ! $offres_emploi->is_active;
        $action->handle($offres_emploi, $active);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $active
                ? bt('toasts.job_offer_activated')
                : bt('toasts.job_offer_deactivated'),
        ]);

        return back();
    }

    public function destroy(JobOffer $offres_emploi, DeleteJobOffer $action): RedirectResponse
    {
        $this->authorize('delete', $offres_emploi);

        $action->handle($offres_emploi);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => bt('toasts.job_offer_deleted'),
        ]);

        return to_route('offres-emploi.index');
    }
}
