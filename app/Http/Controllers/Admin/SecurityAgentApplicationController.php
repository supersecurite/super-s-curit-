<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SecurityAgentApplicationStatus;
use App\Enums\SecurityAgentPost;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSecurityAgentApplicationRequest;
use App\Models\SecurityAgentApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityAgentApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', SecurityAgentApplication::class);

        $query = SecurityAgentApplication::query()->with('reviewedBy');

        if ($request->filled('status') && $request->string('status')->toString() !== 'all') {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('region_id') && $request->string('region_id')->toString() !== 'all') {
            $query->where('region_id', $request->string('region_id')->toString());
        }

        if ($request->filled('prefecture_id') && $request->string('prefecture_id')->toString() !== 'all') {
            $query->where('prefecture_id', $request->string('prefecture_id')->toString());
        }

        if ($request->filled('commune_id') && $request->string('commune_id')->toString() !== 'all') {
            $query->where('commune_id', $request->string('commune_id')->toString());
        }

        if ($request->filled('post') && $request->string('post')->toString() !== 'all') {
            $query->where('post', $request->string('post')->toString());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $postValues = collect(SecurityAgentPost::cases())
                ->filter(fn (SecurityAgentPost $post): bool => str_contains(
                    mb_strtolower($post->label()),
                    mb_strtolower($search),
                ))
                ->map(fn (SecurityAgentPost $post): string => $post->value)
                ->all();

            $query->where(function ($builder) use ($search, $postValues): void {
                $builder
                    ->where('first_name', 'like', '%'.$search.'%')
                    ->orWhere('last_name', 'like', '%'.$search.'%')
                    ->orWhere('phone', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%');

                if ($postValues !== []) {
                    $builder->orWhereIn('post', $postValues);
                }
            });
        }

        $query->orderByDesc('created_at');

        return Inertia::render('candidatures-agents/index', [
            'applications' => $query
                ->paginate(15)
                ->withQueryString()
                ->through(fn (SecurityAgentApplication $application) => $application->toAdminArray()),
            'filters' => $request->only([
                'search',
                'status',
                'post',
                'region_id',
                'prefecture_id',
                'commune_id',
            ]),
            'pendingCount' => SecurityAgentApplication::query()
                ->where('status', SecurityAgentApplicationStatus::Pending)
                ->count(),
            'statuses' => SecurityAgentApplicationStatus::options(),
            'posts' => SecurityAgentPost::options(),
        ]);
    }

    public function show(SecurityAgentApplication $candidaturesAgent): Response
    {
        $this->authorize('view', $candidaturesAgent);

        $candidaturesAgent->load('reviewedBy');

        return Inertia::render('candidatures-agents/show', [
            'application' => $candidaturesAgent->toAdminArray(),
            'statusOptions' => SecurityAgentApplicationStatus::options(),
        ]);
    }

    public function update(
        UpdateSecurityAgentApplicationRequest $request,
        SecurityAgentApplication $candidaturesAgent,
    ): RedirectResponse {
        $validated = $request->validated();
        $status = SecurityAgentApplicationStatus::from($validated['status']);

        $candidaturesAgent->fill([
            'status' => $status,
            'internal_notes' => $validated['internal_notes'] ?? null,
            'reviewed_by_id' => $request->user()->id,
        ]);

        if ($status === SecurityAgentApplicationStatus::Contacted && $candidaturesAgent->contacted_at === null) {
            $candidaturesAgent->contacted_at = now();
        }

        $candidaturesAgent->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Candidature mise à jour avec succès.']);

        return to_route('candidatures-agents.show', $candidaturesAgent);
    }
}
