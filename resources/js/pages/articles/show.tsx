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
import { edit, index, show } from '@/routes/articles';

type UserRef = { id: number; name: string } | null;

type ArticleDetail = {
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
    article: ArticleDetail;
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

export default function ArticlesShow() {
    const { article, publicUrl } = usePage<PageProps>().props;

    setLayoutProps({
        breadcrumbs: [
            { title: 'Actualités', href: index.url() },
            { title: article.title, href: show.url(article.slug) },
        ],
    });

    return (
        <>
            <Head title={article.title} />

            <div className="flex h-full flex-1 flex-col overflow-x-auto py-2 md:py-4">
                <div className="mx-auto w-full max-w-4xl px-4">
                    <Link
                        href={index.url()}
                        className="text-muted-foreground hover:text-super-securite-accent mb-6 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                        <ChevronLeft className="size-4" />
                        Retour aux actualités
                    </Link>

                    <div
                        className={cn(
                            'app-panel mb-6 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between',
                            article.is_own
                                ? 'article-card-own'
                                : 'article-card-other',
                        )}
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={statusBadgeVariant(article.status)}>
                                {article.status_label}
                            </Badge>
                            {article.featured ? (
                                <Badge>
                                    <Star className="mr-1 size-3" />
                                    À la une
                                </Badge>
                            ) : null}
                            <Badge
                                variant={article.is_own ? 'default' : 'outline'}
                                className={cn(
                                    article.is_own &&
                                        'bg-super-securite-accent hover:bg-super-securite-accent',
                                )}
                            >
                                {article.is_own ? 'Mon article' : 'Autre auteur'}
                            </Badge>
                            {article.created_by ? (
                                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                                    <User className="size-3.5" />
                                    {article.created_by.name}
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
                            {article.can_update ? (
                                <Button size="sm" asChild>
                                    <Link href={edit.url(article.slug)}>
                                        <Edit2 className="size-4" />
                                        Modifier
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    <article className="marketing-card overflow-hidden p-0">
                        {article.image_url ? (
                            <div className="relative h-72 md:h-96">
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {article.category ? (
                                    <span className="absolute bottom-4 left-4 rounded-full bg-super-securite-accent px-4 py-1 text-sm font-medium text-white">
                                        {article.category}
                                    </span>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="p-6 md:p-10">
                            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                                {!article.image_url && article.category ? (
                                    <span className="rounded-full bg-super-securite-accent px-4 py-1 font-medium text-white">
                                        {article.category}
                                    </span>
                                ) : null}
                                {article.published_at_formatted ? (
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="size-4" />
                                        {article.published_at_formatted}
                                    </span>
                                ) : article.created_at_formatted ? (
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="size-4" />
                                        {article.created_at_formatted}
                                    </span>
                                ) : null}
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Clock className="size-4" />
                                    {article.formatted_read_time}
                                </span>
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Eye className="size-4" />
                                    {article.views} vues
                                </span>
                            </div>

                            <h1 className="marketing-heading-display mb-6 text-foreground">
                                {article.title}
                            </h1>

                            {article.excerpt ? (
                                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                    {article.excerpt}
                                </p>
                            ) : null}

                            {(article.submitted_at_formatted ||
                                article.approved_at_formatted ||
                                article.rejected_at_formatted) && (
                                <div className="mb-8 rounded-xl border border-border bg-muted/40 p-4 text-sm">
                                    <p className="text-muted-foreground mb-2 font-medium">
                                        Suivi de validation
                                    </p>
                                    <div className="text-muted-foreground space-y-1.5">
                                        {article.submitted_at_formatted ? (
                                            <p>
                                                Soumis le{' '}
                                                {article.submitted_at_formatted}
                                            </p>
                                        ) : null}
                                        {article.approved_by &&
                                        article.approved_at_formatted ? (
                                            <p className="flex items-center gap-2 text-green-700">
                                                <CheckCircle2 className="size-4 shrink-0" />
                                                Validé par{' '}
                                                {article.approved_by.name} —{' '}
                                                {article.approved_at_formatted}
                                            </p>
                                        ) : null}
                                        {article.rejected_by &&
                                        article.rejected_at_formatted ? (
                                            <p className="text-destructive">
                                                Refusé par{' '}
                                                {article.rejected_by.name} —{' '}
                                                {article.rejected_at_formatted}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            {article.tags.length > 0 ? (
                                <div className="mb-8 flex flex-wrap gap-2">
                                    {article.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            ) : null}

                            <ContentRenderer content={article.content} />

                            {(publicUrl ?? show.url(article.slug)) ? (
                                <div className="mt-10">
                                    <ContentShareLinks
                                        title={article.title}
                                        url={
                                            publicUrl ??
                                            show.url(article.slug)
                                        }
                                        description={article.excerpt}
                                        variant="app"
                                    />
                                    {!publicUrl ? (
                                        <p className="text-muted-foreground mt-2 text-xs">
                                            Lien interne — le partage public
                                            sera disponible après publication.
                                        </p>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
