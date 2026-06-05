<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\SecurityTip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityTipController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SecurityTip::query()->published();

        if ($request->filled('category') && $request->string('category')->toString() !== 'all') {
            $query->where('category', $request->string('category')->toString());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('title', 'like', '%'.$search.'%');
        }

        $securityTips = $query
            ->orderByDesc('published_at')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (SecurityTip $securityTip) => $securityTip->toPublicArray());

        $categories = SecurityTip::query()
            ->published()
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values()
            ->all();

        $featuredSecurityTips = SecurityTip::query()
            ->published()
            ->where('featured', true)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn (SecurityTip $securityTip) => $securityTip->toPublicArray())
            ->values()
            ->all();

        return Inertia::render('marketing/conseils-securite/index', [
            'securityTips' => $securityTips,
            'featuredSecurityTips' => $featuredSecurityTips,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function show(SecurityTip $securityTip): Response
    {
        abort_unless($securityTip->isPublished(), 404);

        $securityTip->increment('views');
        $securityTip->refresh();

        $relatedSecurityTips = SecurityTip::query()
            ->published()
            ->where('id', '!=', $securityTip->id)
            ->when(
                $securityTip->category !== null,
                fn ($query) => $query->where('category', $securityTip->category),
            )
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn (SecurityTip $related) => $related->toPublicArray())
            ->values()
            ->all();

        return Inertia::render('marketing/conseils-securite/show', [
            'securityTip' => $securityTip->toPublicArray(),
            'securityTipContent' => $securityTip->content,
            'relatedSecurityTips' => $relatedSecurityTips,
        ]);
    }
}
