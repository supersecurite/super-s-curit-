import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    useEffect(() => {
        document.documentElement.classList.add('app-page');
        document.documentElement.classList.remove('dark', 'marketing-page');
        document.documentElement.style.colorScheme = 'light';

        return () => {
            document.documentElement.classList.remove('app-page');
            document.documentElement.style.colorScheme = '';
        };
    }, []);

    return (
        <div className="app-site flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="app-auth-card flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex cursor-pointer flex-col items-center gap-2 font-medium transition-opacity duration-200 hover:opacity-80"
                        >
                            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                <AppLogoIcon className="size-6 fill-current text-primary-foreground" />
                            </div>
                            <span className="font-heading text-sm font-semibold text-foreground">
                                ARISTECH
                            </span>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
