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
                            <AppLogoIcon
                                className="h-10 w-auto max-w-[200px] object-contain"
                                width={200}
                                height={40}
                            />
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
