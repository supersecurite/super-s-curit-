import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { router } from '@inertiajs/react';
import { ArrowDownUp, Search } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';

export type MarketingContentFiltersState = {
    search?: string;
    category?: string;
    sort_by?: string;
    sort_direction?: string;
};

type MarketingContentFiltersProps = {
    filters: MarketingContentFiltersState;
    categories: string[];
    indexUrl: string;
    searchPlaceholder: string;
};

const SORT_OPTIONS = [
    { value: 'published_at:desc', label: 'Plus récents' },
    { value: 'published_at:asc', label: 'Plus anciens' },
    { value: 'views:desc', label: 'Plus consultés' },
    { value: 'views:asc', label: 'Moins consultés' },
] as const;

function currentSortValue(filters: MarketingContentFiltersState): string {
    const sortBy = filters.sort_by ?? 'published_at';
    const sortDirection = filters.sort_direction ?? 'desc';

    return `${sortBy}:${sortDirection}`;
}

export default function MarketingContentFilters({
    filters,
    categories,
    indexUrl,
    searchPlaceholder,
}: MarketingContentFiltersProps) {
    const { t: uiText } = useUiTranslations();

    const applyFilters = (updates: Partial<MarketingContentFiltersState>) => {
        router.get(
            indexUrl,
            { ...filters, ...updates },
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="mb-10 flex flex-col gap-4 lg:flex-row">
            <div className="relative min-w-0 flex-1">
                <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-super-securite-muted" />
                <input
                    type="search"
                    placeholder={searchPlaceholder}
                    defaultValue={filters.search ?? ''}
                    onChange={(e) => applyFilters({ search: e.target.value })}
                    className="w-full rounded-xl border border-super-securite-border bg-white/70 py-3 pr-4 pl-11 text-super-securite-heading backdrop-blur-sm focus:ring-2 focus:ring-super-securite-accent focus:outline-none"
                />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <SearchableSelect
                    className="min-w-[12rem]"
                    options={[
                        {
                            value: 'all',
                            label: uiText(
                                'ui.all_categories',
                                'Toutes les catégories',
                            ),
                        },
                        ...categories.map((category) => ({
                            value: category,
                            label: category,
                        })),
                    ]}
                    value={filters.category ?? 'all'}
                    onChange={(category) =>
                        applyFilters({
                            category: category === 'all' ? undefined : category,
                        })
                    }
                    placeholder={uiText(
                        'ui.components.text_68a5341fc6bd',
                        'Catégorie',
                    )}
                    searchPlaceholder={uiText(
                        'ui.components.text_8984247e3f42',
                        'Rechercher...',
                    )}
                    triggerClassName="rounded-xl border-super-securite-border bg-white/70 py-3 h-auto"
                />
                <div className="relative min-w-[12rem]">
                    <ArrowDownUp className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-super-securite-muted" />
                    <SearchableSelect
                        className="pl-7"
                        options={SORT_OPTIONS.map((option, index) => ({
                            value: option.value,
                            label: uiText(
                                [
                                    'ui.newest',
                                    'ui.oldest',
                                    'ui.most_viewed',
                                    'ui.least_viewed',
                                ][index],
                                option.label,
                            ),
                        }))}
                        value={currentSortValue(filters)}
                        onChange={(value) => {
                            const [sort_by, sort_direction] = value.split(':');

                            applyFilters({ sort_by, sort_direction });
                        }}
                        placeholder={uiText(
                            'ui.components.text_cdcede56427e',
                            'Trier par',
                        )}
                        searchPlaceholder={uiText(
                            'ui.components.text_8984247e3f42',
                            'Rechercher...',
                        )}
                        triggerClassName="rounded-xl border-super-securite-border bg-white/70 py-3 pl-11 h-auto"
                    />
                </div>
            </div>
        </div>
    );
}
