<?php

namespace App\Http\Controllers;

use App\Enums\ArticleStatus;
use App\Enums\SecurityAgentApplicationStatus;
use App\Models\Article;
use App\Models\SecurityAgentApplication;
use App\Models\SecurityTip;
use App\Models\User;
use App\Models\Visit;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        abort_if($user === null, 403);

        $payload = [
            'overview' => [
                'greeting' => $this->greeting($user->name),
                'role_label' => $user->role->label(),
                'is_admin' => $user->isAdmin(),
            ],
        ];

        if ($user->isAdmin()) {
            $from = now()->subDays(6)->startOfDay();
            $to = now()->endOfDay();

            $payload['stats'] = [
                'visits' => $this->visitStats($from, $to),
                'content' => [
                    'articles_published' => Article::query()
                        ->where('status', ArticleStatus::Published)
                        ->count(),
                    'articles_pending' => Article::query()
                        ->where('status', ArticleStatus::PendingApproval)
                        ->count(),
                    'tips_published' => SecurityTip::query()
                        ->where('status', ArticleStatus::Published)
                        ->count(),
                    'tips_pending' => SecurityTip::query()
                        ->where('status', ArticleStatus::PendingApproval)
                        ->count(),
                ],
                'applications' => [
                    'pending' => SecurityAgentApplication::query()
                        ->where('status', SecurityAgentApplicationStatus::Pending)
                        ->count(),
                    'total' => SecurityAgentApplication::query()->count(),
                    'this_week' => SecurityAgentApplication::query()
                        ->where('created_at', '>=', now()->subDays(7)->startOfDay())
                        ->count(),
                ],
                'users' => User::query()->count(),
            ];
            $payload['trafficChart'] = $this->trafficChart($from, $to);
            $payload['recentApplications'] = SecurityAgentApplication::query()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (SecurityAgentApplication $application): array => [
                    'uuid' => $application->uuid,
                    'full_name' => $application->full_name,
                    'phone' => $application->phone,
                    'status' => $application->status->value,
                    'status_label' => $application->status->label(),
                    'created_at_formatted' => $application->created_at?->locale('fr')->isoFormat('D MMM YYYY à HH:mm'),
                ])
                ->values()
                ->all();
        } else {
            $payload['stats'] = $this->userContentStats($user);
            $payload['recentArticles'] = $this->recentArticlesFor($user);
            $payload['recentTips'] = $this->recentTipsFor($user);
        }

        return Inertia::render('dashboard', $payload);
    }

    private function greeting(string $name): string
    {
        $hour = (int) now()->format('H');

        $salutation = match (true) {
            $hour < 12 => 'Bonjour',
            $hour < 18 => 'Bon après-midi',
            default => 'Bonsoir',
        };

        return $salutation.', '.$name;
    }

    /**
     * @return array{views: int, visitors: int, views_change: float|null}
     */
    private function visitStats(CarbonInterface $from, CarbonInterface $to): array
    {
        $base = Visit::query()->where('is_bot', false);

        $views = (clone $base)->whereBetween('created_at', [$from, $to])->count();
        $visitors = (clone $base)
            ->whereBetween('created_at', [$from, $to])
            ->distinct('visitor_uuid')
            ->count('visitor_uuid');

        $previousFrom = $from->copy()->subDays(7)->startOfDay();
        $previousTo = $from->copy()->subSecond();
        $previousViews = (clone $base)
            ->whereBetween('created_at', [$previousFrom, $previousTo])
            ->count();

        return [
            'views' => $views,
            'visitors' => $visitors,
            'views_change' => $this->percentChange($previousViews, $views),
        ];
    }

    private function percentChange(int $previous, int $current): ?float
    {
        if ($previous === 0) {
            return $current > 0 ? 100.0 : null;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * @return list<array{date: string, views: int, visitors: int}>
     */
    private function trafficChart(CarbonInterface $from, CarbonInterface $to): array
    {
        $rows = Visit::query()
            ->where('is_bot', false)
            ->whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw('DATE(created_at) as visit_date'),
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT visitor_uuid) as visitors'),
            )
            ->groupBy('visit_date')
            ->orderBy('visit_date')
            ->get()
            ->keyBy('visit_date');

        $span = (int) $from->copy()->startOfDay()->diffInDays($to->copy()->startOfDay());

        $days = [];
        for ($i = 0; $i <= $span; $i++) {
            $date = $from->copy()->startOfDay()->addDays($i)->toDateString();
            $row = $rows->get($date);
            $days[] = [
                'date' => $date,
                'views' => (int) ($row?->views ?? 0),
                'visitors' => (int) ($row?->visitors ?? 0),
            ];
        }

        return $days;
    }

    /**
     * @return array{
     *     articles: array{total: int, published: int, pending: int, rejected: int, draft: int, views: int},
     *     tips: array{total: int, published: int, pending: int, rejected: int, draft: int, views: int}
     * }
     */
    private function userContentStats(User $user): array
    {
        return [
            'articles' => $this->contentSummaryFor(Article::query(), $user),
            'tips' => $this->contentSummaryFor(SecurityTip::query(), $user),
        ];
    }

    /**
     * @param  Builder<Article|SecurityTip>  $query
     * @return array{total: int, published: int, pending: int, rejected: int, draft: int, views: int}
     */
    private function contentSummaryFor($query, User $user): array
    {
        $base = (clone $query)->where('created_by_id', $user->id);

        return [
            'total' => (clone $base)->count(),
            'published' => (clone $base)
                ->where('status', ArticleStatus::Published)
                ->count(),
            'pending' => (clone $base)
                ->where('status', ArticleStatus::PendingApproval)
                ->count(),
            'rejected' => (clone $base)
                ->where('status', ArticleStatus::Rejected)
                ->count(),
            'draft' => (clone $base)
                ->where('status', ArticleStatus::Draft)
                ->count(),
            'views' => (int) (clone $base)->sum('views'),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function recentArticlesFor(User $user): array
    {
        return Article::query()
            ->where('created_by_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Article $article): array => [
                'title' => $article->title,
                'slug' => $article->slug,
                'status' => $article->status->value,
                'status_label' => $article->status->label(),
                'views' => $article->views,
                'created_at_formatted' => $article->created_at?->locale('fr')->isoFormat('D MMM YYYY'),
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function recentTipsFor(User $user): array
    {
        return SecurityTip::query()
            ->where('created_by_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (SecurityTip $securityTip): array => [
                'title' => $securityTip->title,
                'slug' => $securityTip->slug,
                'status' => $securityTip->status->value,
                'status_label' => $securityTip->status->label(),
                'views' => $securityTip->views,
                'created_at_formatted' => $securityTip->created_at?->locale('fr')->isoFormat('D MMM YYYY'),
            ])
            ->values()
            ->all();
    }
}
