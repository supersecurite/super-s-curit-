import { NavUser } from '@/components/nav-user';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppSidebarHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-card/80 px-4 text-foreground backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:h-16 md:rounded-t-xl md:px-5">
            <div className="flex min-w-0 items-center">
                <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex min-w-0 items-center gap-2">
                <NavUser variant="header" />
            </div>
        </header>
    );
}
