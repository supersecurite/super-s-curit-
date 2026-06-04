import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-primary-foreground" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="font-heading mb-0.5 truncate leading-tight font-semibold text-SUPER_SECURITE-heading">
                    SUPER_SECURITE
                </span>
            </div>
        </>
    );
}
