import {
    BarChart3,
    Briefcase,
    ChevronDown,
    Handshake,
    Images,
    LayoutGrid,
    Lightbulb,
    Newspaper,
    Search,
    Users,
    Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type PermissionOption = {
    value: string;
    label: string;
    description: string;
};

export type PermissionGroup = {
    key: string;
    label: string;
    permissions: PermissionOption[];
};

const FEATURE_ICONS: Record<string, typeof LayoutGrid> = {
    dashboard: LayoutGrid,
    articles: Newspaper,
    conseils: Lightbulb,
    gallery_images: Images,
    gallery_videos: Video,
    analytics: BarChart3,
    agent_applications: Briefcase,
    users: Users,
    partners: Handshake,
};

type UserPermissionsPanelProps = {
    groups: PermissionGroup[];
    initialPermissions?: string[];
    error?: string;
};

function normalizeSearch(value: string): string {
    return value.trim().toLowerCase();
}

export default function UserPermissionsPanel({
    groups,
    initialPermissions = [],
    error,
}: UserPermissionsPanelProps) {
    const [selected, setSelected] = useState<Set<string>>(
        () => new Set(initialPermissions),
    );
    const [search, setSearch] = useState('');

    const expandedByDefault = useMemo(() => {
        const activeGroups = groups.filter((group) =>
            group.permissions.some((permission) =>
                initialPermissions.includes(permission.value),
            ),
        );

        if (activeGroups.length > 0) {
            return new Set(activeGroups.map((group) => group.key));
        }

        return new Set(groups.map((group) => group.key));
    }, [groups, initialPermissions]);

    const [expanded, setExpanded] = useState<Set<string>>(expandedByDefault);

    const totalPermissions = groups.reduce(
        (count, group) => count + group.permissions.length,
        0,
    );

    const filteredGroups = useMemo(() => {
        const query = normalizeSearch(search);
        if (!query) {
            return groups;
        }

        return groups
            .map((group) => {
                const groupMatches = group.label.toLowerCase().includes(query);
                const permissions = group.permissions.filter(
                    (permission) =>
                        groupMatches ||
                        permission.label.toLowerCase().includes(query) ||
                        permission.description.toLowerCase().includes(query) ||
                        permission.value.toLowerCase().includes(query),
                );

                if (permissions.length === 0) {
                    return null;
                }

                return { ...group, permissions };
            })
            .filter((group): group is PermissionGroup => group !== null);
    }, [groups, search]);

    const togglePermission = (value: string, checked: boolean) => {
        setSelected((current) => {
            const next = new Set(current);
            if (checked) {
                next.add(value);
            } else {
                next.delete(value);
            }
            return next;
        });
    };

    const setGroupPermissions = (
        group: PermissionGroup,
        enabled: boolean,
    ) => {
        setSelected((current) => {
            const next = new Set(current);
            group.permissions.forEach((permission) => {
                if (enabled) {
                    next.add(permission.value);
                } else {
                    next.delete(permission.value);
                }
            });
            return next;
        });
    };

    const setAllPermissions = (enabled: boolean) => {
        setSelected(() => {
            if (!enabled) {
                return new Set();
            }

            return new Set(
                groups.flatMap((group) =>
                    group.permissions.map((permission) => permission.value),
                ),
            );
        });
    };

    const toggleGroupExpanded = (key: string) => {
        setExpanded((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    return (
        <fieldset className="space-y-4">
            <legend className="sr-only">Permissions backoffice</legend>

            {Array.from(selected).map((value) => (
                <input
                    key={value}
                    type="hidden"
                    name="permissions[]"
                    value={value}
                />
            ))}

            <div className="app-panel space-y-4 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h2 className="font-heading text-lg font-semibold">
                            Permissions backoffice
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Accordez l&apos;accès par fonctionnalité et par
                            action. Les modifications sont enregistrées avec le
                            reste du profil.
                        </p>
                    </div>
                    <Badge variant="secondary" className="w-fit shrink-0">
                        {selected.size} / {totalPermissions} actives
                    </Badge>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative min-w-0 flex-1">
                        <Search
                            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                            aria-hidden
                        />
                        <Input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Rechercher une fonctionnalité ou une action..."
                            className="pl-9"
                            aria-label="Rechercher une permission"
                        />
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setAllPermissions(true)}
                        >
                            Tout activer
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setAllPermissions(false)}
                        >
                            Tout désactiver
                        </Button>
                    </div>
                </div>
            </div>

            {filteredGroups.length === 0 ? (
                <div className="app-panel p-6">
                    <p className="text-muted-foreground text-sm">
                        Aucune permission ne correspond à votre recherche.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredGroups.map((group) => {
                        const Icon =
                            FEATURE_ICONS[group.key] ?? LayoutGrid;
                        const activeCount = group.permissions.filter(
                            (permission) =>
                                selected.has(permission.value),
                        ).length;
                        const isExpanded = expanded.has(group.key);
                        const allEnabled =
                            activeCount === group.permissions.length;
                        const noneEnabled = activeCount === 0;

                        return (
                            <div
                                key={group.key}
                                className="app-panel overflow-hidden"
                            >
                                <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleGroupExpanded(group.key)
                                        }
                                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                                        aria-expanded={isExpanded}
                                    >
                                        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                                            <Icon
                                                className="size-4"
                                                aria-hidden
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-heading text-sm font-semibold">
                                                    {group.label}
                                                </h3>
                                                <Badge
                                                    variant={
                                                        activeCount > 0
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {activeCount} /{' '}
                                                    {group.permissions.length}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground mt-0.5 text-xs">
                                                {activeCount > 0
                                                    ? `${activeCount} action${activeCount > 1 ? 's' : ''} autorisée${activeCount > 1 ? 's' : ''}`
                                                    : 'Aucun accès accordé'}
                                            </p>
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                                                isExpanded && 'rotate-180',
                                            )}
                                            aria-hidden
                                        />
                                    </button>

                                    <div className="flex gap-2 sm:shrink-0">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={allEnabled}
                                            onClick={() =>
                                                setGroupPermissions(
                                                    group,
                                                    true,
                                                )
                                            }
                                        >
                                            Tout
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={noneEnabled}
                                            onClick={() =>
                                                setGroupPermissions(
                                                    group,
                                                    false,
                                                )
                                            }
                                        >
                                            Aucun
                                        </Button>
                                    </div>
                                </div>

                                {isExpanded ? (
                                    <div className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {group.permissions.map((permission) => {
                                            const isChecked = selected.has(
                                                permission.value,
                                            );

                                            return (
                                                <label
                                                    key={permission.value}
                                                    className={cn(
                                                        'hover:border-super-securite-accent/40 flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors',
                                                        isChecked
                                                            ? 'border-super-securite-accent/50 bg-super-securite-accent/5'
                                                            : 'border-border bg-background',
                                                    )}
                                                >
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            togglePermission(
                                                                permission.value,
                                                                checked === true,
                                                            )
                                                        }
                                                        className="mt-0.5"
                                                    />
                                                    <span className="min-w-0">
                                                        <span className="block text-sm font-medium">
                                                            {permission.label}
                                                        </span>
                                                        <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                                                            {
                                                                permission.description
                                                            }
                                                        </span>
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            )}

            <InputError message={error} />
        </fieldset>
    );
}
