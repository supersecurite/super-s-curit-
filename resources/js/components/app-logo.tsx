import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-md">
                <AppLogoIcon className="h-6 w-auto max-w-full object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="font-heading mb-0.5 truncate leading-tight font-semibold text-SUPER_SECURITE-heading">
                    SUPER_SECURITE
                </span>
            </div>
        </>
    );
}
