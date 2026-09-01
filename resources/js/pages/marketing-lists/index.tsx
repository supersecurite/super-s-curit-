import { Head, Link, router, usePage } from '@inertiajs/react';
import { List, Pencil, Plus, Search } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import {
    create,
    destroy,
    edit,
    index,
    show,
} from '@/routes/marketing-lists';

type ListRow = {
    uuid: string;
    name: string;
    description: string | null;
    contacts_count: number;
    can_update: boolean;
    can_delete: boolean;
};

type PaginatedLists = {
    data: ListRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    lists: PaginatedLists;
    filters: { search?: string };
    canCreate: boolean;
};

export default function MarketingListsIndex() {
    const { lists, filters, canCreate } = usePage<PageProps>().props;

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

    return (
        <>
            <Head title="Listes de diffusion" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
                            <List className="size-6" aria-hidden />
                            Listes de diffusion
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Organisez vos contacts en audiences pour les campagnes.
                        </p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="size-4" aria-hidden />
                                Nouvelle liste
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <div className="relative max-w-md">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        type="search"
                        placeholder="Rechercher une liste..."
                        defaultValue={filters.search ?? ''}
                        onChange={(event) =>
                            debouncedSearch(event.target.value)
                        }
                        className="pl-9"
                    />
                </div>

                <div className="app-panel overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-muted/50 border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Nom</th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                    <th className="px-4 py-3 font-medium">Contacts</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lists.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-muted-foreground px-4 py-8 text-center"
                                        >
                                            Aucune liste pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    lists.data.map((list) => (
                                        <tr
                                            key={list.uuid}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                <Link
                                                    href={show.url(list.uuid)}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {list.name}
                                                </Link>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {list.description ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {list.contacts_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={show.url(list.uuid)}>
                                                            Voir
                                                        </Link>
                                                    </Button>
                                                    {list.can_update ? (
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={edit.url(list.uuid)}
                                                                aria-label={`Modifier ${list.name}`}
                                                            >
                                                                <Pencil
                                                                    className="size-4"
                                                                    aria-hidden
                                                                />
                                                            </Link>
                                                        </Button>
                                                    ) : null}
                                                    {list.can_delete ? (
                                                        <ConfirmDeleteDialog
                                                            title="Supprimer cette liste ?"
                                                            description={`La liste « ${list.name} » sera supprimée.`}
                                                            deleteUrl={destroy.url(list.uuid)}
                                                            triggerSize="icon"
                                                            triggerVariant="outline"
                                                            triggerClassName="text-destructive hover:text-destructive"
                                                            aria-label={`Supprimer ${list.name}`}
                                                        />
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {lists.last_page > 1 && (
                    <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-4 text-sm">
                        <span>
                            Page {lists.current_page} sur {lists.last_page} (
                            {lists.total} listes)
                        </span>
                        <div className="flex gap-2">
                            {lists.current_page > 1 && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={index.url({
                                            query: {
                                                page: lists.current_page - 1,
                                                ...(filters.search
                                                    ? { search: filters.search }
                                                    : {}),
                                            },
                                        })}
                                    >
                                        Précédent
                                    </Link>
                                </Button>
                            )}
                            {lists.current_page < lists.last_page && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={index.url({
                                            query: {
                                                page: lists.current_page + 1,
                                                ...(filters.search
                                                    ? { search: filters.search }
                                                    : {}),
                                            },
                                        })}
                                    >
                                        Suivant
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

MarketingListsIndex.layout = {
    breadcrumbs: [{ title: 'Listes de diffusion', href: index.url() }],
};
