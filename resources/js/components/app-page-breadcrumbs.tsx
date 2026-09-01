import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import { showNavigationLoader } from '@/lib/navigation-loader';
import { dashboard } from '@/routes';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type AppPageBreadcrumbsProps = {
    breadcrumbs: BreadcrumbItemType[];
    className?: string;
};

export function AppPageBreadcrumbs({
    breadcrumbs,
    className,
}: AppPageBreadcrumbsProps) {
    if (breadcrumbs.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'relative shrink-0 border-b border-border/50 bg-gradient-to-r from-muted/50 via-background to-primary/[0.04]',
                className,
            )}
        >
            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/90 to-transparent md:hidden"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/90 to-transparent md:hidden"
                aria-hidden
            />

            <div className="mx-auto flex max-w-full items-center gap-3 px-4 py-2.5 md:px-6 md:py-3">
                <Link
                    href={dashboard()}
                    prefetch
                    onClick={showNavigationLoader}
                    className="group flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-muted-foreground shadow-xs transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    aria-label="Tableau de bord"
                >
                    <Home className="size-4 transition-transform group-hover:scale-105" />
                </Link>

                <div className="hidden h-5 w-px shrink-0 bg-border/70 sm:block" />

                <nav
                    aria-label="Fil d'Ariane"
                    className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    <ol className="flex min-w-max items-center gap-1 text-sm">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;

                            return (
                                <Fragment key={`${item.title}-${index}`}>
                                    {index > 0 && (
                                        <li
                                            aria-hidden
                                            className="mx-0.5 flex shrink-0 items-center text-muted-foreground/50"
                                        >
                                            <ChevronRight className="size-3.5" />
                                        </li>
                                    )}
                                    <li className="flex shrink-0 items-center">
                                        {isLast ? (
                                            <span
                                                aria-current="page"
                                                className="inline-flex max-w-[min(100vw-8rem,20rem)] items-center gap-2 truncate rounded-md bg-primary/[0.08] px-2.5 py-1 font-medium text-foreground ring-1 ring-primary/15 sm:max-w-xs"
                                            >
                                                <span
                                                    className="size-1.5 shrink-0 rounded-full bg-primary"
                                                    aria-hidden
                                                />
                                                <span className="truncate">
                                                    {item.title}
                                                </span>
                                            </span>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                prefetch
                                                onClick={
                                                    showNavigationLoader
                                                }
                                                className="inline-flex max-w-[10rem] truncate rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground sm:max-w-[12rem]"
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </li>
                                </Fragment>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </div>
    );
}
