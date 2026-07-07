import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    KeyRound,
    Mail,
    Phone,
    Save,
    Shield,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import UserForm, {
    type PermissionGroup,
    type RoleOption,
    type UserFormData,
    type UserFormTab,
} from '@/components/users/user-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { edit, index, update } from '@/routes/users';

type PageProps = {
    user: UserFormData & {
        id: number;
        uuid: string;
        role_label: string;
        created_at: string | null;
    };
    roles: RoleOption[];
    permissionGroups: PermissionGroup[];
    tab: UserFormTab;
};

const tabs: {
    value: UserFormTab;
    label: string;
    icon: typeof User;
    description: string;
}[] = [
    {
        value: 'profile',
        label: 'Profil',
        icon: User,
        description: 'Identité et rôle',
    },
    {
        value: 'permissions',
        label: 'Permissions',
        icon: Shield,
        description: 'Accès backoffice',
    },
    {
        value: 'security',
        label: 'Sécurité',
        icon: KeyRound,
        description: 'Mot de passe',
    },
];

function roleBadgeVariant(
    role: string,
): 'default' | 'secondary' | 'outline' {
    if (role === 'super_admin') {
        return 'default';
    }

    if (role === 'admin') {
        return 'secondary';
    }

    return 'outline';
}

function userInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function formatCreatedAt(value: string | null): string | null {
    if (!value) {
        return null;
    }

    return new Date(value).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function UsersEdit() {
    const { user, roles, permissionGroups, tab } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState(false);
    const createdAt = formatCreatedAt(user.created_at);

    useEffect(() => {
        const form = document.getElementById('user-edit-form');

        const handleSubmit = () => {
            setProcessing(true);
        };

        form?.addEventListener('submit', handleSubmit);

        const offFinish = router.on('finish', () => {
            setProcessing(false);
        });
        const offError = router.on('error', () => {
            setProcessing(false);
        });

        return () => {
            form?.removeEventListener('submit', handleSubmit);
            offFinish();
            offError();
        };
    }, []);

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Utilisateurs',
                href: index.url(),
            },
            {
                title: user.name,
                href: edit.url(user.uuid, { query: { tab } }),
            },
        ],
    });

    const switchTab = (nextTab: UserFormTab) => {
        if (nextTab === tab) {
            return;
        }

        router.get(
            edit.url(user.uuid, { query: { tab: nextTab } }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title={`${user.name} — Utilisateur`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button variant="ghost" size="sm" className="-ml-2" asChild>
                        <Link href={index.url()}>
                            <ArrowLeft className="size-4" aria-hidden />
                            Retour aux utilisateurs
                        </Link>
                    </Button>

                    <Button
                        type="submit"
                        form="user-edit-form"
                        disabled={processing}
                    >
                        <Save className="size-4" aria-hidden />
                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>

                <div className="app-panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
                    <Avatar className="size-16 border-2 border-super-securite-accent/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-heading text-lg font-semibold">
                            {userInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="font-heading truncate text-2xl font-semibold tracking-tight">
                                {user.name}
                            </h1>
                            <Badge variant={roleBadgeVariant(user.role)}>
                                {user.role_label}
                            </Badge>
                        </div>

                        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="size-3.5 shrink-0" aria-hidden />
                                {user.email}
                            </span>
                            {user.phone ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <Phone
                                        className="size-3.5 shrink-0"
                                        aria-hidden
                                    />
                                    {user.phone}
                                </span>
                            ) : null}
                        </div>

                        <p className="text-muted-foreground font-mono text-xs">
                            {user.uuid}
                            {createdAt ? ` · Créé le ${createdAt}` : ''}
                        </p>
                    </div>
                </div>

                <nav
                    className="border-border flex gap-1 overflow-x-auto border-b"
                    aria-label="Sections utilisateur"
                >
                    {tabs.map(({ value, label, icon: Icon, description }) => {
                        const isActive = tab === value;

                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => switchTab(value)}
                                className={cn(
                                    'flex min-w-[9rem] cursor-pointer flex-col items-start gap-0.5 border-b-2 px-4 py-3 text-left transition-colors',
                                    isActive
                                        ? 'border-super-securite-accent text-foreground'
                                        : 'text-muted-foreground hover:text-foreground border-transparent',
                                )}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <Icon className="size-4" aria-hidden />
                                    {label}
                                </span>
                                <span className="text-xs">{description}</span>
                            </button>
                        );
                    })}
                </nav>

                <UserForm
                    formId="user-edit-form"
                    activeTab={tab}
                    showActions={false}
                    roles={roles}
                    permissionGroups={permissionGroups}
                    user={user}
                    formDefinition={update.form(user.uuid)}
                    submitLabel="Enregistrer"
                    cancelHref={index.url()}
                />
            </div>
        </>
    );
}
