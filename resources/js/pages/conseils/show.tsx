import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Edit2,
    ExternalLink,
    Eye,
    Star,
    User,
} from 'lucide-react';
import ContentRenderer from '@/components/lexical-editor/content-renderer';
import ContentShareLinks from '@/components/content-share-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { edit, index, show } from '@/routes/conseils';

type UserRef = { id: number; name: string } | null;

type SecurityTipDetail = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    image_url: string | null;
    category: string | null;
    tags: string[];
    featured: boolean;
    views: number;
    read_time: number;
    formatted_read_time: string;
    status: string;
    status_label: string;
    can_update: boolean;
    can_delete: boolean;
    is_own: boolean;
    created_by: UserRef;
    approved_by: UserRef;
    rejected_by: UserRef;
    created_at_formatted: string | null;
    submitted_at_formatted: string | null;
    approved_at_formatted: string | null;
    rejected_at_formatted: string | null;
    published_at_formatted: string | null;
};

type PageProps = {
    securityTip: SecurityTipDetail;
    canApprove: boolean;
    publicUrl: string | null;
};

function statusBadgeVariant(
    status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (status === 'published') {
        return 'default';
    }
    if (status === 'pending_approval') {
        return 'secondary';
    }
    if (status === 'rejected') {
        return 'destructive';
    }
    return 'outline';
}

export default function ConseilsShow() {
    const { securityTip, publicUrl } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Conseils', href: index.url() },
            { title: securityTip.title, href: show.url(securityTip.slug) },
        ],
    });

    return (
        <>
            <Head title={securityTip.title} />

            <div className="flex h-full flex-1 flex-col overflow-x-auto py-2 md:py-4">
                <div className="mx-auto w-full max-w-4xl px-4">
                    <Link
                        href={index.url()}
                        className="text-muted-foreground hover:text-super-securite-accent mb-6 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                        <ChevronLeft className="size-4" />
                        Retour aux conseils
                    </Link>

                    <div
                        className={cn(
                            'app-panel mb-6 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between',
                            securityTip.is_own
                                ? 'article-card-own'
                                : 'article-card-other',
                        )}
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant={statusBadgeVariant(securityTip.status)}
                            >
                                {securityTip.status_label}
                            </Badge>
                            {securityTip.featured ? (
                                <Badge>
                                    <Star className="mr-1 size-3" />
                                    À la une
                                </Badge>
                            ) : null}
                            <Badge
                                variant={
                                    securityTip.is_own ? 'default' : 'outline'
                                }
                                className={cn(
                                    securityTip.is_own &&
                                        'bg-super-securite-accent hover:bg-super-securite-accent',
                                )}
                            >
                                {securityTip.is_own
                                    ? 'Mon conseil'
                                    : 'Autre auteur'}
                            </Badge>
                            {securityTip.created_by ? (
                                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                                    <User className="size-3.5" />
                                    {securityTip.created_by.name}
                                </span>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {publicUrl ? (
                                <Button variant="outline" size="sm" asChild>
                                    <a
                                        href={publicUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="size-4" />
                                        Voir en ligne
                                    </a>
                                </Button>
                            ) : null}
                            {securityTip.can_update ? (
                                <Button size="sm" asChild>
                                    <Link href={edit.url(securityTip.slug)}>
                                        <Edit2 className="size-4" />
                                        Modifier
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    <article className="marketing-card overflow-hidden p-0">
                        {securityTip.image_url ? (
                            <div className="relative h-72 md:h-96">
                                <img
                                    src={securityTip.image_url}
                                    alt={securityTip.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {securityTip.category ? (
                                    <span className="absolute bottom-4 left-4 rounded-full bg-super-securite-accent px-4 py-1 text-sm font-medium text-white">
                                        {securityTip.category}
                                    </span>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="p-6 md:p-10">
                            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                                {!securityTip.image_url &&
                                securityTip.category ? (
                                    <span className="rounded-full bg-super-securite-accent px-4 py-1 font-medium text-white">
                                        {securityTip.category}
                                    </span>
                                ) : null}
                                {securityTip.published_at_formatted ? (
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="size-4" />
                                        {securityTip.published_at_formatted}
                                    </span>
                                ) : securityTip.created_at_formatted ? (
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="size-4" />
                                        {securityTip.created_at_formatted}
                                    </span>
                                ) : null}
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Clock className="size-4" />
                                    {securityTip.formatted_read_time}
                                </span>
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Eye className="size-4" />
                                    {securityTip.views} vues
                                </span>
                            </div>

                            <h1 className="marketing-heading-display mb-6 text-foreground">
                                {securityTip.title}
                            </h1>

                            {securityTip.excerpt ? (
                                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                    {securityTip.excerpt}
                                </p>
                            ) : null}

                            {(securityTip.submitted_at_formatted ||
                                securityTip.approved_at_formatted ||
                                securityTip.rejected_at_formatted) && (
                                <div className="mb-8 rounded-xl border border-border bg-muted/40 p-4 text-sm">
                                    <p className="text-muted-foreground mb-2 font-medium">
                                        Suivi de validation
                                    </p>
                                    <div className="text-muted-foreground space-y-1.5">
                                        {securityTip.submitted_at_formatted ? (
                                            <p>
                                                Soumis le{' '}
                                                {
                                                    securityTip.submitted_at_formatted
                                                }
                                            </p>
                                        ) : null}
                                        {securityTip.approved_by &&
                                        securityTip.approved_at_formatted ? (
                                            <p className="flex items-center gap-2 text-green-700">
                                                <CheckCircle2 className="size-4 shrink-0" />
                                                Validé par{' '}
                                                {securityTip.approved_by.name} —{' '}
                                                {
                                                    securityTip.approved_at_formatted
                                                }
                                            </p>
                                        ) : null}
                                        {securityTip.rejected_by &&
                                        securityTip.rejected_at_formatted ? (
                                            <p className="text-destructive">
                                                Refusé par{' '}
                                                {securityTip.rejected_by.name}{' '}
                                                —{' '}
                                                {
                                                    securityTip.rejected_at_formatted
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            {securityTip.tags.length > 0 ? (
                                <div className="mb-8 flex flex-wrap gap-2">
                                    {securityTip.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            ) : null}

                            <ContentRenderer content={securityTip.content} />

                            <div className="mt-10">
                                <ContentShareLinks
                                    title={securityTip.title}
                                    url={
                                        publicUrl ?? show.url(securityTip.slug)
                                    }
                                    description={securityTip.excerpt}
                                    variant="app"
                                />
                                {!publicUrl ? (
                                    <p className="text-muted-foreground mt-2 text-xs">
                                        Lien interne — le partage public sera
                                        disponible après publication.
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
