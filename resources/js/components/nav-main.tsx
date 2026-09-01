import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { showNavigationLoader } from '@/lib/navigation-loader';
import type { NavGroup, NavItem } from '@/types';

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
    if (item.href && isCurrentOrParentUrl(item.href)) {
        return true;
    }

    return (
        item.children?.some((child) =>
            itemIsActive(child, isCurrentOrParentUrl),
        ) ?? false
    );
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
    const childActive = itemIsActive(item, isCurrentOrParentUrl);
    const [open, setOpen] = useState(childActive);

    useEffect(() => {
        if (childActive) {
            setOpen(true);
        }
    }, [childActive]);

    if (item.children?.length) {
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
                                    key={child.title}
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
    onNavigate,
}: {
    item: NavItem;
    onNavigate?: () => void;
}) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const childActive = itemIsActive(item, isCurrentOrParentUrl);
    const [open, setOpen] = useState(childActive);

    useEffect(() => {
        if (childActive) {
            setOpen(true);
        }
    }, [childActive]);

    return (
        <Collapsible
            asChild
            open={open}
            onOpenChange={setOpen}
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
                                key={child.title}
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

    return (
        <>
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
        </>
    );
}
