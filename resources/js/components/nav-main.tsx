import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';
import { showNavigationLoader } from '@/lib/navigation-loader';
import type { NavGroup, NavItem } from '@/types';

type NavMenuAccordionContextValue = {
    expandedKey: string | null;
    setExpandedKey: (key: string | null) => void;
};

const NavMenuAccordionContext =
    createContext<NavMenuAccordionContextValue | null>(null);

function useNavMenuAccordion(): NavMenuAccordionContextValue {
    const context = useContext(NavMenuAccordionContext);

    if (!context) {
        throw new Error('useNavMenuAccordion must be used within NavMain');
    }

    return context;
}

function navItemKey(groupTitle: string, itemTitle: string): string {
    return `${groupTitle}/${itemTitle}`;
}

function findActiveMenuKey(
    groups: NavGroup[],
    isCurrentOrParentUrl: (
        href: NonNullable<NavItem['href']>,
        current?: string,
    ) => boolean,
): string | null {
    for (const group of groups) {
        for (const item of group.items) {
            if (
                item.children?.length &&
                itemIsActive(item, isCurrentOrParentUrl)
            ) {
                return navItemKey(group.title, item.title);
            }
        }
    }

    return null;
}

function handleNavClick(onNavigate?: () => void): void {
    showNavigationLoader();
    onNavigate?.();
}

function NavBadge({ count }: { count: number }) {
    if (count <= 0) {
        return null;
    }

    return (
        <Badge className="ml-auto size-5 justify-center rounded-full border-transparent bg-yellow-400 px-0 text-[10px] font-semibold text-yellow-950 hover:bg-yellow-400">
            {count > 9 ? '9+' : count}
        </Badge>
    );
}

function itemIsActive(
    item: NavItem,
    isCurrentOrParentUrl: (
        href: NonNullable<NavItem['href']>,
        current?: string,
    ) => boolean,
): boolean {
    if (item.isSectionLabel) {
        return false;
    }

    if (item.href && isCurrentOrParentUrl(item.href)) {
        return true;
    }

    return (
        item.children?.some((child) =>
            itemIsActive(child, isCurrentOrParentUrl),
        ) ?? false
    );
}

function navChildKey(child: NavItem): string {
    if (child.isSectionLabel) {
        return `label-${child.title}`;
    }

    if (typeof child.href === 'string') {
        return child.href;
    }

    if (child.href && typeof child.href === 'object' && 'url' in child.href) {
        return String(child.href.url);
    }

    return child.title;
}

function NestedNavSectionLabel({ title }: { title: string }) {
    return (
        <SidebarMenuSubItem>
            <span className="text-black px-2 pt-2.5 pb-1 text-[10px] font-bold tracking-wide uppercase">
                {title}
            </span>
        </SidebarMenuSubItem>
    );
}

function CollapsedNavDropdownItems({
    items,
    onNavigate,
}: {
    items: NavItem[];
    onNavigate?: () => void;
}) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return items.map((child) => {
        if (child.isSectionLabel) {
            return (
                <DropdownMenuLabel
                    key={navChildKey(child)}
                    className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase"
                >
                    {child.title}
                </DropdownMenuLabel>
            );
        }

        if (child.children?.length) {
            return (
                <DropdownMenuSub key={navChildKey(child)}>
                    <DropdownMenuSubTrigger>{child.title}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <CollapsedNavDropdownItems
                            items={child.children}
                            onNavigate={onNavigate}
                        />
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            );
        }

        if (!child.href) {
            return null;
        }

        const active = isCurrentOrParentUrl(child.href);

        return (
            <DropdownMenuItem key={navChildKey(child)} asChild>
                <Link
                    href={child.href}
                    prefetch
                    onClick={() => handleNavClick(onNavigate)}
                    className={cn(
                        'flex w-full items-center justify-between gap-2',
                        active && 'bg-accent font-medium',
                    )}
                >
                    <span>{child.title}</span>
                    {child.badge ? <NavBadge count={child.badge} /> : null}
                </Link>
            </DropdownMenuItem>
        );
    });
}

function NavLinkItem({
    item,
    onNavigate,
}: {
    item: NavItem;
    onNavigate?: () => void;
}) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    if (!item.href) {
        return null;
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isCurrentOrParentUrl(item.href)}
                tooltip={{ children: item.title }}
            >
                <Link
                    href={item.href}
                    prefetch
                    onClick={() => handleNavClick(onNavigate)}
                >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge ? <NavBadge count={item.badge} /> : null}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function NestedNavChild({
    item,
    onNavigate,
}: {
    item: NavItem;
    onNavigate?: () => void;
}) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const page = usePage();
    const childActive = itemIsActive(item, isCurrentOrParentUrl);
    const hydrated = useHydrated();
    const [open, setOpen] = useState(childActive);

    // Replie à chaque navigation si aucun enfant n'est actif (ex. menu ouvert manuellement).
    useEffect(() => {
        setOpen(childActive);
    }, [childActive, page.url]);

    if (item.isSectionLabel) {
        return <NestedNavSectionLabel title={item.title} />;
    }

    if (item.children?.length) {
        if (!hydrated) {
            return (
                <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                        isActive={childActive}
                        className="cursor-default"
                    >
                        <span>{item.title}</span>
                        <ChevronRight
                            className={cn(
                                'ml-auto size-3.5 transition-transform duration-200',
                                childActive && 'rotate-90',
                            )}
                        />
                    </SidebarMenuSubButton>
                    {childActive ? (
                        <SidebarMenuSub className="mr-0 ml-3.5 border-l border-sidebar-border px-0 py-0.5 translate-x-px">
                            {item.children.map((child) => (
                                <NestedNavChild
                                    key={navChildKey(child)}
                                    item={child}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </SidebarMenuSub>
                    ) : null}
                </SidebarMenuSubItem>
            );
        }

        return (
            <SidebarMenuSubItem>
                <Collapsible
                    open={open}
                    onOpenChange={setOpen}
                    className="group/nested"
                >
                    <CollapsibleTrigger asChild>
                        <SidebarMenuSubButton
                            isActive={childActive}
                            className="cursor-pointer"
                        >
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/nested:rotate-90" />
                        </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub className="mr-0 ml-3.5 border-l border-sidebar-border px-0 py-0.5 translate-x-px">
                            {item.children.map((child) => (
                                <NestedNavChild
                                    key={navChildKey(child)}
                                    item={child}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuSubItem>
        );
    }

    if (!item.href) {
        return null;
    }

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                isActive={isCurrentOrParentUrl(item.href)}
            >
                <Link
                    href={item.href}
                    prefetch
                    onClick={() => handleNavClick(onNavigate)}
                >
                    <span>{item.title}</span>
                    {item.badge ? <NavBadge count={item.badge} /> : null}
                </Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
}

function NavSubmenuItem({
    item,
    menuKey,
    onNavigate,
}: {
    item: NavItem;
    menuKey: string;
    onNavigate?: () => void;
}) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { state, isMobile } = useSidebar();
    const childActive = itemIsActive(item, isCurrentOrParentUrl);
    const hydrated = useHydrated();
    const { expandedKey, setExpandedKey } = useNavMenuAccordion();
    const isCollapsed = state === 'collapsed' && !isMobile;
    const open = expandedKey === menuKey;

    const handleOpenChange = (next: boolean): void => {
        setExpandedKey(next ? menuKey : null);
    };

    if (isCollapsed) {
        return (
            <SidebarMenuItem>
                <DropdownMenu open={open} onOpenChange={handleOpenChange}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton isActive={childActive}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={8}
                        className="min-w-52 rounded-lg"
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            {item.title}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <CollapsedNavDropdownItems
                            items={item.children ?? []}
                            onNavigate={onNavigate}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        );
    }

    if (!hydrated) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    tooltip={{ children: item.title }}
                    isActive={childActive}
                >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                        className={cn(
                            'ml-auto size-4 transition-transform duration-200',
                            childActive && 'rotate-90',
                        )}
                    />
                </SidebarMenuButton>
                {childActive ? (
                    <SidebarMenuSub>
                        {item.children?.map((child) => (
                            <NestedNavChild
                                key={navChildKey(child)}
                                item={child}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </SidebarMenuSub>
                ) : null}
            </SidebarMenuItem>
        );
    }

    return (
        <Collapsible
            asChild
            open={open}
            onOpenChange={handleOpenChange}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={{ children: item.title }}
                        isActive={childActive}
                    >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children?.map((child) => (
                            <NestedNavChild
                                key={navChildKey(child)}
                                item={child}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

export function NavMain({
    groups = [],
    items,
    onNavigate,
}: {
    groups?: NavGroup[];
    /** @deprecated Préférer `groups` — conservé pour compatibilité. */
    items?: NavItem[];
    onNavigate?: () => void;
}) {
    const resolvedGroups: NavGroup[] =
        groups.length > 0
            ? groups
            : items && items.length > 0
              ? [{ title: 'Plateforme', items }]
              : [];

    const { isCurrentOrParentUrl } = useCurrentUrl();
    const page = usePage();

    const activeMenuKey = useMemo(
        () => findActiveMenuKey(resolvedGroups, isCurrentOrParentUrl),
        [resolvedGroups, isCurrentOrParentUrl, page.url],
    );

    const [expandedKey, setExpandedKey] = useState<string | null>(activeMenuKey);

    useEffect(() => {
        setExpandedKey(activeMenuKey);
    }, [page.url, activeMenuKey]);

    const accordionValue = useMemo(
        () => ({ expandedKey, setExpandedKey }),
        [expandedKey],
    );

    return (
        <NavMenuAccordionContext.Provider value={accordionValue}>
            {resolvedGroups.map((group) => (
                <SidebarGroup key={group.title} className="px-2 py-0">
                    <SidebarGroupLabel className="text-[11px] tracking-wide uppercase">
                        {group.title}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) =>
                            item.children?.length ? (
                                <NavSubmenuItem
                                    key={item.title}
                                    item={item}
                                    menuKey={navItemKey(group.title, item.title)}
                                    onNavigate={onNavigate}
                                />
                            ) : (
                                <NavLinkItem
                                    key={item.title}
                                    item={item}
                                    onNavigate={onNavigate}
                                />
                            ),
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </NavMenuAccordionContext.Provider>
    );
}
