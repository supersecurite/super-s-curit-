import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { marketingServiceNavLinks } from '@/data/marketing-nav';
import {
    isMarketingNavActive,
    isMarketingServicesNavActive,
} from '@/lib/marketing-nav-active';
import { cn } from '@/lib/utils';

type MarketingServicesNavProps = {
    pathname: string;
};

export default function MarketingServicesNav({
    pathname,
}: MarketingServicesNavProps) {
    const active = isMarketingServicesNavActive(pathname);

    return (
        <li className="group/services relative">
            <button
                type="button"
                aria-haspopup="true"
                className={cn(
                    'relative inline-flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none',
                    active
                        ? 'font-semibold text-super-securite-accent'
                        : 'text-white/80 hover:text-white',
                )}
            >
                Services
                <ChevronDown
                    className="size-4 transition-transform duration-200 group-hover/services:rotate-180 group-focus-within/services:rotate-180"
                    aria-hidden
                />
                <span
                    className={cn(
                        'absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-super-securite-accent transition-transform duration-300 ease-out motion-reduce:transition-none',
                        active
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover/services:scale-x-100 group-focus-within/services:scale-x-100',
                    )}
                    aria-hidden
                />
            </button>

            <div className="absolute top-full left-1/2 z-50 hidden w-80 -translate-x-1/2 pt-3 group-focus-within/services:block group-hover/services:block">
                <div className="rounded-2xl border border-super-securite-border bg-super-securite-surface p-2 shadow-xl shadow-black/20">
                    <ul role="menu">
                        {marketingServiceNavLinks.map((service) => {
                            const itemActive = isMarketingNavActive(
                                service.href,
                                pathname,
                            );

                            return (
                                <li key={service.href} role="none">
                                    <Link
                                        href={service.href}
                                        role="menuitem"
                                        prefetch
                                        className={cn(
                                            'block rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-super-securite-bg',
                                            itemActive &&
                                                'bg-super-securite-accent/8',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'block font-heading text-sm font-semibold',
                                                itemActive
                                                    ? 'text-super-securite-accent'
                                                    : 'text-super-securite-heading',
                                            )}
                                        >
                                            {service.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </li>
    );
}
