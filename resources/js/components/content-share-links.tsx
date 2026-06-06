import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContentShare } from '@/hooks/use-content-share';
import { cn } from '@/lib/utils';

type ContentShareLinksProps = {
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

export default function ContentShareLinks({
    title,
    url,
    description,
    variant = 'app',
    className,
}: ContentShareLinksProps) {
    const { absoluteUrl, actions, canNativeShare, nativeShare } =
        useContentShare(title, url, description);

    const isMarketing = variant === 'marketing';

    return (
        <div
            className={cn(
                'rounded-xl border p-4',
                isMarketing
                    ? 'border-super-securite-border bg-super-securite-surface'
                    : 'border-border bg-muted/30',
                className,
            )}
        >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p
                    className={cn(
                        'text-sm font-semibold',
                        isMarketing
                            ? 'text-super-securite-heading'
                            : 'text-foreground',
                    )}
                >
                    Partager
                </p>
                {canNativeShare ? (
                    <Button
                        type="button"
                        size="sm"
                        variant={isMarketing ? 'outline' : 'secondary'}
                        onClick={() => void nativeShare()}
                    >
                        <Share2 className="size-4" />
                        Partager…
                    </Button>
                ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
                {actions.map((action) => {
                    const Icon = action.icon;
                    const isX = action.id === 'x';

                    if (action.onClick) {
                        return (
                            <Button
                                key={action.id}
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => void action.onClick?.()}
                                className={cn(
                                    isMarketing &&
                                        'border-super-securite-border hover:border-super-securite-accent/50',
                                )}
                            >
                                {isX ? (
                                    <XIcon className="size-4" />
                                ) : (
                                    <Icon className="size-4" />
                                )}
                                {action.label}
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={action.id}
                            size="sm"
                            variant="outline"
                            asChild
                            className={cn(
                                isMarketing &&
                                    'border-super-securite-border hover:border-super-securite-accent/50',
                            )}
                        >
                            <a
                                href={action.href}
                                target={action.external ? '_blank' : undefined}
                                rel={
                                    action.external
                                        ? 'noopener noreferrer'
                                        : undefined
                                }
                            >
                                {isX ? (
                                    <XIcon className="size-4" />
                                ) : (
                                    <Icon className="size-4" />
                                )}
                                {action.label}
                            </a>
                        </Button>
                    );
                })}
            </div>

            <p
                className={cn(
                    'mt-3 truncate text-xs',
                    isMarketing
                        ? 'text-super-securite-muted'
                        : 'text-muted-foreground',
                )}
            >
                {absoluteUrl}
            </p>
        </div>
    );
}
