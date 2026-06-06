import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useContentShare } from '@/hooks/use-content-share';
import { cn } from '@/lib/utils';

type ContentShareButtonProps = {
    title: string;
    url: string;
    description?: string | null;
    variant?: 'marketing' | 'app';
    className?: string;
};

function XIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={className}
            fill="currentColor"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export default function ContentShareButton({
    title,
    url,
    description,
    variant = 'app',
    className,
}: ContentShareButtonProps) {
    const { actions, canNativeShare, nativeShare } = useContentShare(
        title,
        url,
        description,
    );
    const isMarketing = variant === 'marketing';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Partager"
                    className={cn(
                        isMarketing &&
                            'text-super-securite-muted hover:text-super-securite-accent hover:bg-super-securite-accent/10',
                        className,
                    )}
                    onClick={(event) => event.stopPropagation()}
                >
                    <Share2 className="size-4" />
                    <span className="sr-only">Partager</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Partager</DropdownMenuLabel>
                {canNativeShare ? (
                    <>
                        <DropdownMenuItem onClick={() => void nativeShare()}>
                            <Share2 className="size-4" />
                            Partager…
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                ) : null}
                {actions.map((action) => {
                    const Icon = action.icon;
                    const isX = action.id === 'x';

                    if (action.onClick) {
                        return (
                            <DropdownMenuItem
                                key={action.id}
                                onClick={() => void action.onClick?.()}
                            >
                                <Icon className="size-4" />
                                {action.label}
                            </DropdownMenuItem>
                        );
                    }

                    return (
                        <DropdownMenuItem key={action.id} asChild>
                            <a
                                href={action.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {isX ? (
                                    <XIcon className="size-4" />
                                ) : (
                                    <Icon className="size-4" />
                                )}
                                {action.label}
                            </a>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
