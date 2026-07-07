import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    Eye,
    LayoutList,
    Plus,
    Search,
    Shield,
    Star,
    Trash2,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ContentShareButton from '@/components/content-share-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { cn } from '@/lib/utils';
import { create, destroy, edit, index, show } from '@/routes/conseils';
import { show as conseilsPublicShow } from '@/routes/conseils-securite';

type UserRef = { id: number; name: string } | null;

type SecurityTipRow = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    category: string | null;
    featured: boolean;
    views: number;
    read_time: number;
    status: string;
    status_label: string;
    can_update: boolean;
    can_delete: boolean;
    is_own: boolean;
    created_by: UserRef;
    approved_by: UserRef;
    rejected_by: UserRef;
    created_at_formatted: string | null;
    submitted_at_formatted: string | null;
    approved_at_formatted: string | null;
    rejected_at_formatted: string | null;
    published_at_formatted: string | null;
};

type StatusOption = { value: string; label: string };

type PaginatedSecurityTips = {
    data: SecurityTipRow[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type SecurityTipTab = 'all' | 'pending';

type PageProps = {
    securityTips: PaginatedSecurityTips;
    filters: {
        search?: string;
        category?: string;
        status?: string;
        tab?: SecurityTipTab;
    };
    tab: SecurityTipTab;
    canApprove: boolean;
    pendingCount: number;
    canCreate: boolean;
    categories: string[];
    statuses: StatusOption[];
};

const tabs: { value: SecurityTipTab; label: string; icon: typeof LayoutList }[] = [
    { value: 'all', label: 'Tous les conseils', icon: LayoutList },
    { value: 'pending', label: 'En attente de validation', icon: Clock },
];

function statusBadgeVariant(
    status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (status === 'published') {
        return 'default';
    }
    if (status === 'pending_approval') {
        return 'secondary';
    }
    if (status === 'rejected') {
        return 'destructive';
    }
    return 'outline';
}

export default function ConseilsIndex() {
    const {
        securityTips,
        filters,
        tab,
        canApprove,
        pendingCount,
        categories,
        statuses,
        canCreate,
    } = usePage<PageProps>().props;

    const applyFilters = (updates: Record<string, string | undefined>) => {
        const next = { ...filters, ...updates };

        Object.keys(next).forEach((key) => {
            if (next[key as keyof typeof next] === undefined) {
                delete next[key as keyof typeof next];
            }
        });

        router.get(index.url(), next, { preserveState: true, replace: true });
    };

    const debouncedSearch = useDebouncedCallback((search: string) => {
        applyFilters({ search: search || undefined });
    });

    const switchTab = (nextTab: SecurityTipTab) => {
        if (nextTab === 'pending') {
            applyFilters({ tab: nextTab, status: undefined });
            return;
        }

        applyFilters({ tab: nextTab });
    };

    const handleDelete = (securityTip: SecurityTipRow) => {
        if (
            !window.confirm(
                `Archiver le conseil « ${securityTip.title} » ? Il ne sera plus visible publiquement.`,
            )
        ) {
            return;
        }

        router.delete(destroy.url(securityTip.slug));
    };

    return (
        <>
            <Head title="Conseils de sécurité" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Shield className="size-6" aria-hidden />
                            Conseils de sécurité
                            {canApprove && pendingCount > 0 ? (
                                <Badge variant="destructive" className="text-xs">
                                    {pendingCount} en attente
                                </Badge>
                            ) : null}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {canApprove
                                ? 'Gérez, validez et publiez les conseils du site.'
                                : 'Consultez tous les conseils et gérez vos propres contenus.'}
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                Nouveau conseil
                            </Link>
                        </Button>
                    ) : null}
                </div>

                {canApprove ? (
                    <div className="inline-flex w-fit gap-1 rounded-lg bg-muted p-1">
                        {tabs.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => switchTab(value)}
                                className={cn(
                                    'flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors',
                                    tab === value
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                                )}
                            >
                                <Icon className="size-4" aria-hidden />
                                {label}
                                {value === 'pending' && pendingCount > 0 ? (
                                    <Badge
                                        variant={
                                            tab === 'pending'
                                                ? 'destructive'
                                                : 'secondary'
                                        }
                                        className="size-5 justify-center rounded-full px-0 text-[10px]"
                                    >
                                        {pendingCount > 9 ? '9+' : pendingCount}
                                    </Badge>
                                ) : null}
                            </button>
                        ))}
                    </div>
                ) : null}

                <div
                    className={cn(
                        'app-panel grid gap-4 p-4',
                        tab === 'all' ? 'md:grid-cols-4' : 'md:grid-cols-3',
                    )}
                >
                    <div className="relative md:col-span-2">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            className="pl-9"
                            placeholder="Rechercher par titre..."
                            defaultValue={filters.search ?? ''}
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                        defaultValue={filters.category ?? 'all'}
                        onChange={(e) =>
                            applyFilters({ category: e.target.value })
                        }
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {tab === 'all' ? (
                        <select
                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                            defaultValue={filters.status ?? 'all'}
                            onChange={(e) =>
                                applyFilters({ status: e.target.value })
                            }
                        >
                            <option value="all">Tous les statuts</option>
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    ) : null}
                </div>

                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-medium text-foreground">Légende :</span>
                    <span className="inline-flex items-center gap-2 rounded-md border border-super-securite-accent/30 bg-super-securite-accent/5 px-2.5 py-1">
                        <span className="size-2 rounded-full bg-super-securite-accent" />
                        Mes conseils
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-md border border-dashed border-slate-300/90 bg-slate-50/70 px-2.5 py-1">
                        <span className="size-2 rounded-full bg-slate-400" />
                        Conseils des autres auteurs
                    </span>
                </div>

                {tab === 'pending' && canApprove && pendingCount === 0 ? (
                    <div className="app-panel p-8 text-center">
                        <CheckCircle2 className="text-muted-foreground mx-auto size-10" />
                        <p className="mt-3 font-medium">
                            Aucun conseil en attente de validation
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Tous les conseils ont été traités.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {securityTips.data.map((securityTip) => (
                            <article
                                key={securityTip.id}
                                className={cn(
                                    'app-panel overflow-hidden',
                                    securityTip.is_own
                                        ? 'article-card-own'
                                        : 'article-card-other',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex items-center gap-2 px-5 py-2.5',
                                        securityTip.is_own
                                            ? 'article-card-author-own'
                                            : 'article-card-author-other',
                                    )}
                                >
                                    <User
                                        className={cn(
                                            'size-4 shrink-0',
                                            securityTip.is_own
                                                ? 'text-super-securite-accent'
                                                : 'text-slate-500',
                                        )}
                                        aria-hidden
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                            {securityTip.created_by?.name ??
                                                'Auteur inconnu'}
                                        </p>
                                        {securityTip.created_at_formatted ? (
                                            <p className="text-muted-foreground truncate text-[11px]">
                                                Créé le{' '}
                                                {securityTip.created_at_formatted}
                                            </p>
                                        ) : null}
                                    </div>
                                    <Badge
                                        variant={
                                            securityTip.is_own
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className={cn(
                                            'shrink-0 text-[10px]',
                                            securityTip.is_own &&
                                                'bg-super-securite-accent hover:bg-super-securite-accent',
                                        )}
                                    >
                                        {securityTip.is_own
                                            ? 'Mon conseil'
                                            : 'Autre auteur'}
                                    </Badge>
                                </div>

                                {securityTip.image_url ? (
                                    <img
                                        src={securityTip.image_url}
                                        alt={securityTip.title}
                                        className="h-44 w-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-muted flex h-44 items-center justify-center">
                                        <Shield className="text-muted-foreground size-10" />
                                    </div>
                                )}

                                <div className="space-y-3 p-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant={statusBadgeVariant(
                                                securityTip.status,
                                            )}
                                        >
                                            {securityTip.status_label}
                                        </Badge>
                                        {securityTip.category ? (
                                            <Badge variant="outline">
                                                {securityTip.category}
                                            </Badge>
                                        ) : null}
                                        {securityTip.featured ? (
                                            <Badge>
                                                <Star className="mr-1 size-3" />
                                                À la une
                                            </Badge>
                                        ) : null}
                                    </div>

                                    <h2 className="font-heading line-clamp-2 text-lg font-semibold">
                                        <Link
                                            href={show.url(securityTip.slug)}
                                            className="hover:text-super-securite-accent transition-colors"
                                        >
                                            {securityTip.title}
                                        </Link>
                                    </h2>

                                    {securityTip.excerpt ? (
                                        <p className="text-muted-foreground line-clamp-2 text-sm">
                                            {securityTip.excerpt}
                                        </p>
                                    ) : null}

                                    <div className="text-muted-foreground space-y-1.5 text-xs">
                                        {securityTip.submitted_at_formatted ? (
                                            <p className="flex items-center gap-1 text-amber-700">
                                                <Clock className="size-3.5" />
                                                Soumis le{' '}
                                                {
                                                    securityTip.submitted_at_formatted
                                                }
                                            </p>
                                        ) : null}
                                        {securityTip.approved_by ? (
                                            <p className="flex items-center gap-1 text-green-700">
                                                <CheckCircle2 className="size-3.5" />
                                                Validé par{' '}
                                                {securityTip.approved_by.name}
                                                {securityTip.approved_at_formatted
                                                    ? ` — ${securityTip.approved_at_formatted}`
                                                    : ''}
                                            </p>
                                        ) : null}
                                        {securityTip.rejected_by ? (
                                            <p className="text-destructive">
                                                Refusé par{' '}
                                                {securityTip.rejected_by.name}
                                                {securityTip.rejected_at_formatted
                                                    ? ` — ${securityTip.rejected_at_formatted}`
                                                    : ''}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="text-muted-foreground flex items-center gap-4 text-xs">
                                        <span className="flex items-center gap-1">
                                            <Eye className="size-3.5" />
                                            {securityTip.views}
                                        </span>
                                        <span>{securityTip.read_time} min</span>
                                        {securityTip.published_at_formatted ? (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="size-3.5" />
                                                {
                                                    securityTip.published_at_formatted
                                                }
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="flex justify-end gap-2 border-t pt-3">
                                        <ContentShareButton
                                            title={securityTip.title}
                                            url={
                                                securityTip.status ===
                                                'published'
                                                    ? conseilsPublicShow.url(
                                                          securityTip.slug,
                                                      )
                                                    : show.url(
                                                          securityTip.slug,
                                                      )
                                            }
                                            description={securityTip.excerpt}
                                            variant="app"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={show.url(
                                                    securityTip.slug,
                                                )}
                                                title="Voir le conseil"
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                        </Button>
                                        {securityTip.can_update ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={edit.url(
                                                        securityTip.slug,
                                                    )}
                                                >
                                                    <Edit2 className="size-4" />
                                                </Link>
                                            </Button>
                                        ) : null}
                                        {securityTip.can_delete ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(securityTip)
                                                }
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {tab === 'all' && securityTips.data.length === 0 ? (
                    <div className="app-panel p-8 text-center">
                        <p className="text-muted-foreground">
                            Aucun conseil trouvé.
                        </p>
                    </div>
                ) : null}

                {securityTips.last_page > 1 ? (
                    <div className="flex flex-wrap justify-center gap-2">
                        {securityTips.links.map((link, linkIndex) => (
                            <Button
                                key={linkIndex}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url, {}, {
                                            preserveState: true,
                                        });
                                    }
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    );
}

ConseilsIndex.layout = {
    breadcrumbs: [{ title: 'Conseils', href: index.url() }],
};
