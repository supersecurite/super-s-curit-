import { Breadcrumbs } from '@/components/breadcrumbs';
import { NavUser } from '@/components/nav-user';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const sidebarSurfaceClassName =
    'bg-gradient-to-r from-[color:var(--primary-800)] via-[color:var(--primary-700)] to-[color:var(--primary-600)]/95 dark:from-[color:var(--primary-200)]/95 dark:via-[color:var(--primary-300)]/90 dark:to-[color:var(--primary-400)]/95 text-white backdrop-blur-2xl backdrop-saturate-200';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header
            className={cn(
                'relative flex h-16 shrink-0 items-center overflow-hidden px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4',
                sidebarSurfaceClassName,
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[color:var(--primary-500)]/20 via-[color:var(--accent-500)]/20 to-[color:var(--primary-500)]/20 opacity-30" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[color:var(--primary-400)]/60 to-transparent shadow-lg shadow-[color:var(--primary-400)]/50" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[color:var(--primary-400)]/60 to-transparent shadow-lg shadow-[color:var(--primary-400)]/50" />

            <div className="relative z-10 flex w-full items-center gap-2">
                <div className="flex items-center gap-2 [&_[data-slot=breadcrumb-link]]:text-white/70 [&_[data-slot=breadcrumb-link]]:hover:text-white [&_[data-slot=breadcrumb-list]]:text-white/70 [&_[data-slot=breadcrumb-page]]:text-white [&_[data-slot=breadcrumb-separator]]:text-white/50">
                    <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 hover:text-white" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <NavUser variant="header" />
                </div>
            </div>
        </header>
    );
}
