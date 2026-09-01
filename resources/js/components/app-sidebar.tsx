import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Contact,
    Globe,
    Handshake,
    History,
    Images,
    LayoutGrid,
    List,
    Newspaper,
    Shield,
    UserPlus,
    Users,
    Video,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar';
import { showNavigationLoader } from '@/lib/navigation-loader';
import { dashboard, home } from '@/routes';
import { index as galleryImagesIndex } from '@/routes/gallery-images';
import { index as galleryVideosIndex } from '@/routes/gallery-videos';
import { index as analyticsIndex } from '@/routes/analytics';
import { index as articlesIndex } from '@/routes/articles';
import { index as conseilsIndex } from '@/routes/conseils';
import { index as candidaturesAgentsIndex } from '@/routes/candidatures-agents';
import { index as usersIndex } from '@/routes/users';
import { index as partnersIndex } from '@/routes/partners';
import { index as marketingClientsIndex } from '@/routes/marketing-clients';
import { index as marketingListsIndex } from '@/routes/marketing-lists';
import { index as accessLogsIndex } from '@/routes/access-logs';
import type { Auth, NavGroup, NavItem } from '@/types';

function hasFeatureAccess(permissions: string[], feature: string): boolean {
    return permissions.some((permission) =>
        permission.startsWith(`${feature}.`),
    );
}

const footerNavItems: NavItem[] = [
    {
        title: 'Site web',
        href: home(),
        icon: Globe,
    },
];

type SidebarPageProps = {
    auth: Auth;
    articlesPendingCount?: number;
    securityTipsPendingCount?: number;
    securityAgentApplicationsPendingCount?: number;
};

type NavBadges = {
    articles: number;
    conseils: number;
    candidatures: number;
};

function buildNavGroups(
    permissions: string[],
    badges: NavBadges,
    canApprove: { articles: boolean; conseils: boolean },
): NavGroup[] {
    const groups: NavGroup[] = [];

    if (hasFeatureAccess(permissions, 'dashboard')) {
        groups.push({
            title: 'Vue d\'ensemble',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ],
        });
    }

    const editorialChildren: NavItem[] = [];

    if (hasFeatureAccess(permissions, 'articles')) {
        editorialChildren.push({
            title: 'Actualités',
            href: articlesIndex.url(),
            ...(canApprove.articles && badges.articles > 0
                ? { badge: badges.articles }
                : {}),
        });
    }

    if (hasFeatureAccess(permissions, 'conseils')) {
        editorialChildren.push({
            title: 'Conseils',
            href: conseilsIndex.url(),
            ...(canApprove.conseils && badges.conseils > 0
                ? { badge: badges.conseils }
                : {}),
        });
    }

    if (editorialChildren.length > 1) {
        groups.push({
            title: 'Contenu',
            items: [
                {
                    title: 'Éditorial',
                    icon: Newspaper,
                    children: editorialChildren,
                },
            ],
        });
    } else if (editorialChildren.length === 1) {
        const [item] = editorialChildren;

        groups.push({
            title: 'Contenu',
            items: [
                {
                    ...item,
                    icon: item.title === 'Actualités' ? Newspaper : Shield,
                },
            ],
        });
    }

    const galleryChildren: NavItem[] = [];

    if (hasFeatureAccess(permissions, 'gallery_images')) {
        galleryChildren.push({
            title: 'Photos',
            href: galleryImagesIndex.url(),
        });
    }

    if (hasFeatureAccess(permissions, 'gallery_videos')) {
        galleryChildren.push({
            title: 'Vidéos',
            href: galleryVideosIndex.url(),
        });
    }

    if (galleryChildren.length > 1) {
        groups.push({
            title: 'Médias',
            items: [
                {
                    title: 'Galerie',
                    icon: Images,
                    children: galleryChildren,
                },
            ],
        });
    } else if (galleryChildren.length === 1) {
        const [item] = galleryChildren;

        groups.push({
            title: 'Médias',
            items: [
                {
                    ...item,
                    icon: item.title === 'Photos' ? Images : Video,
                },
            ],
        });
    }

    const adminChildren: NavItem[] = [];

    if (hasFeatureAccess(permissions, 'users')) {
        adminChildren.push({
            title: 'Utilisateurs',
            href: usersIndex.url(),
        });
    }

    if (hasFeatureAccess(permissions, 'partners')) {
        adminChildren.push({
            title: 'Partenaires',
            href: partnersIndex.url(),
        });
    }

    if (hasFeatureAccess(permissions, 'agent_applications')) {
        adminChildren.push({
            title: 'Candidatures agents',
            href: candidaturesAgentsIndex.url(),
            ...(badges.candidatures > 0
                ? { badge: badges.candidatures }
                : {}),
        });
    }

    if (adminChildren.length > 1) {
        groups.push({
            title: 'Administration',
            items: [
                {
                    title: 'Gestion',
                    icon: Users,
                    children: adminChildren,
                },
            ],
        });
    } else if (adminChildren.length === 1) {
        const [item] = adminChildren;

        groups.push({
            title: 'Administration',
            items: [
                {
                    ...item,
                    icon:
                        item.title === 'Utilisateurs'
                            ? Users
                            : item.title === 'Partenaires'
                              ? Handshake
                              : UserPlus,
                },
            ],
        });
    }

    const marketingChildren: NavItem[] = [];

    if (hasFeatureAccess(permissions, 'marketing_clients')) {
        marketingChildren.push({
            title: 'Contacts',
            href: marketingClientsIndex.url(),
        });
        marketingChildren.push({
            title: 'Listes',
            href: marketingListsIndex.url(),
        });
    }

    if (marketingChildren.length > 1) {
        groups.push({
            title: 'Marketing',
            items: [
                {
                    title: 'Marketing',
                    icon: Contact,
                    children: marketingChildren,
                },
            ],
        });
    } else if (marketingChildren.length === 1) {
        const [item] = marketingChildren;

        groups.push({
            title: 'Marketing',
            items: [
                {
                    ...item,
                    icon: item.title === 'Contacts' ? Contact : List,
                },
            ],
        });
    }

    if (hasFeatureAccess(permissions, 'analytics') || hasFeatureAccess(permissions, 'access_logs')) {
        const insightItems: NavItem[] = [];

        if (hasFeatureAccess(permissions, 'analytics')) {
            insightItems.push({
                title: 'Analytics',
                href: analyticsIndex.url(),
                icon: BarChart3,
            });
        }

        if (hasFeatureAccess(permissions, 'access_logs')) {
            insightItems.push({
                title: 'Journal d\'accès',
                href: accessLogsIndex.url(),
                icon: History,
            });
        }

        groups.push({
            title: 'Insights',
            items: insightItems,
        });
    }

    return groups;
}

export function AppSidebar() {
    const { isMobile, setOpenMobile } = useSidebar();
    const {
        auth,
        articlesPendingCount = 0,
        securityTipsPendingCount = 0,
        securityAgentApplicationsPendingCount = 0,
    } = usePage<SidebarPageProps>().props;

    const permissions = auth.user?.permissions ?? [];
    const canApproveArticles = auth.user?.can_approve_articles ?? false;
    const canApproveConseils = auth.user?.can_approve_conseils ?? false;

    const navGroups = buildNavGroups(
        permissions,
        {
            articles: articlesPendingCount,
            conseils: securityTipsPendingCount,
            candidatures: securityAgentApplicationsPendingCount,
        },
        {
            articles: canApproveArticles,
            conseils: canApproveConseils,
        },
    );

    const closeMobile = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-white/10 active:bg-white/15"
                        >
                            <Link
                                href={dashboard()}
                                prefetch
                                onClick={() => {
                                    showNavigationLoader();
                                    closeMobile();
                                }}
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator className="mx-2" />

            <SidebarContent className="pt-2">
                <NavMain groups={navGroups} onNavigate={closeMobile} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
