import { Form, Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { index, reply, show } from '@/routes/marketing-conversations';
import { show as showContact } from '@/routes/marketing-clients';

type MessageRow = {
    uuid: string;
    direction: 'inbound' | 'outbound';
    direction_label: string;
    from_email: string;
    to_email: string;
    subject: string | null;
    body_html: string | null;
    body_text: string | null;
    sent_at_formatted: string;
    author_name: string | null;
};

type ConversationData = {
    uuid: string;
    subject: string | null;
    unread_inbound_count: number;
    contact: {
        uuid: string;
        full_name: string;
        email: string | null;
    } | null;
};

type PageProps = {
    conversation: ConversationData;
    messages: MessageRow[];
    canReply: boolean;
};

export default function MarketingConversationsShow() {
    const { conversation, messages, canReply } = usePage<PageProps>().props;
    const [sending, setSending] = useState(false);

    setLayoutProps({
        breadcrumbs: [
            { title: 'Conversations e-mail', href: index.url() },
            {
                title: conversation.contact?.full_name ?? 'Conversation',
                href: show.url(conversation.uuid),
            },
        ],
    });

    return (
        <>
            <Head title={conversation.contact?.full_name ?? 'Conversation'} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Link
                            href={index.url()}
                            className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
                        >
                            <ArrowLeft className="size-4" aria-hidden />
                            Retour aux conversations
                        </Link>
                        <h1 className="font-heading text-2xl font-semibold tracking-tight">
                            {conversation.contact?.full_name ?? 'Conversation'}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            {conversation.contact?.email ? (
                                <Badge variant="outline">{conversation.contact.email}</Badge>
                            ) : null}
                            {conversation.subject ? (
                                <Badge variant="secondary">{conversation.subject}</Badge>
                            ) : null}
                            {conversation.contact ? (
                                <Button variant="link" className="h-auto p-0" asChild>
                                    <Link href={showContact.url(conversation.contact.uuid)}>
                                        Voir la fiche contact
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="app-panel flex min-h-[320px] flex-1 flex-col gap-4 p-4">
                    <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                        {messages.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                Aucun message pour l&apos;instant. Les réponses des
                                destinataires apparaîtront ici.
                            </p>
                        ) : (
                            messages.map((message) => (
                                <article
                                    key={message.uuid}
                                    className={cn(
                                        'max-w-[85%] rounded-xl border p-3 text-sm',
                                        message.direction === 'outbound'
                                            ? 'bg-primary/5 ml-auto border-primary/20'
                                            : 'bg-muted/40 mr-auto',
                                    )}
                                >
                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                        <p className="font-medium">
                                            {message.direction === 'outbound'
                                                ? (message.author_name ?? 'Équipe')
                                                : (conversation.contact?.full_name ??
                                                  message.from_email)}
                                        </p>
                                        <time className="text-muted-foreground text-xs">
                                            {message.sent_at_formatted}
                                        </time>
                                    </div>
                                    {message.body_html ? (
                                        <div
                                            className="prose prose-sm dark:prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: message.body_html,
                                            }}
                                        />
                                    ) : (
                                        <p className="whitespace-pre-wrap">
                                            {message.body_text}
                                        </p>
                                    )}
                                </article>
                            ))
                        )}
                    </div>

                    {canReply ? (
                        <Form
                            action={reply.url(conversation.uuid)}
                            method="post"
                            className="border-t pt-4"
                            onStart={() => setSending(true)}
                            onFinish={() => setSending(false)}
                        >
                            {({ errors }) => (
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="body">Votre réponse</Label>
                                        <Textarea
                                            id="body"
                                            name="body"
                                            rows={4}
                                            placeholder="Rédigez votre message…"
                                            required
                                        />
                                        {errors.body ? (
                                            <p className="text-destructive text-sm">
                                                {errors.body}
                                            </p>
                                        ) : null}
                                    </div>
                                    <Button type="submit" disabled={sending}>
                                        <Send className="size-4" aria-hidden />
                                        {sending ? 'Envoi…' : 'Envoyer'}
                                    </Button>
                                </div>
                            )}
                        </Form>
                    ) : null}
                </div>
            </div>
        </>
    );
}

MarketingConversationsShow.layout = {
    breadcrumbs: [
        { title: 'Conversations e-mail', href: index.url() },
        { title: 'Fil', href: show.url('') },
    ],
};
