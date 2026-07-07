import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Handshake,
    Images,
    LayoutGrid,
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
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as galleryImagesIndex } from '@/routes/gallery-images';
import { index as galleryVideosIndex } from '@/routes/gallery-videos';
import { index as analyticsIndex } from '@/routes/analytics';
import { index as articlesIndex } from '@/routes/articles';
import { index as conseilsIndex } from '@/routes/conseils';
import { index as candidaturesAgentsIndex } from '@/routes/candidatures-agents';
import { index as usersIndex } from '@/routes/users';
import { index as partnersIndex } from '@/routes/partners';
import type { Auth, NavItem } from '@/types';

function hasFeatureAccess(permissions: string[], feature: string): boolean {
    return permissions.some((permission) =>
        permission.startsWith(`${feature}.`),
    );
}

const NAV_PERMISSION_MAP: Array<{
    permission: string;
    item: Omit<NavItem, 'badge'>;
}> = [
    {
        permission: 'dashboard',
        item: {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    },
    {
        permission: 'articles',
        item: {
            title: 'Actualités',
            href: articlesIndex.url(),
            icon: Newspaper,
        },
    },
    {
        permission: 'conseils',
        item: {
            title: 'Conseils',
            href: conseilsIndex.url(),
            icon: Shield,
        },
    },
    {
        permission: 'gallery_images',
        item: {
            title: 'Galerie',
            href: galleryImagesIndex.url(),
            icon: Images,
        },
    },
    {
        permission: 'gallery_videos',
        item: {
            title: 'Vidéos galerie',
            href: galleryVideosIndex.url(),
            icon: Video,
        },
    },
    {
        permission: 'analytics',
        item: {
            title: 'Analytics',
            href: analyticsIndex.url(),
            icon: BarChart3,
        },
    },
    {
        permission: 'agent_applications',
        item: {
            title: 'Candidatures agents',
            href: candidaturesAgentsIndex.url(),
            icon: UserPlus,
        },
    },
    {
        permission: 'users',
        item: {
            title: 'Utilisateurs',
            href: usersIndex.url(),
            icon: Users,
        },
    },
    {
        permission: 'partners',
        item: {
            title: 'Partenaires',
            href: partnersIndex.url(),
            icon: Handshake,
        },
    },
];

function buildMainNavItems(permissions: string[]): NavItem[] {
    return NAV_PERMISSION_MAP.filter(({ permission }) =>
        hasFeatureAccess(permissions, permission),
    ).map(({ item }) => item);
}

const footerNavItems: NavItem[] = [];

type SidebarPageProps = {
    auth: Auth;
    articlesPendingCount?: number;
    securityTipsPendingCount?: number;
    securityAgentApplicationsPendingCount?: number;
};

export function AppSidebar() {
    const {
        auth,
        articlesPendingCount = 0,
        securityTipsPendingCount = 0,
        securityAgentApplicationsPendingCount = 0,
    } = usePage<SidebarPageProps>().props;

    const permissions = auth.user?.permissions ?? [];
    const canApproveArticles = auth.user?.can_approve_articles ?? false;
    const canApproveConseils = auth.user?.can_approve_conseils ?? false;

    const mainNavItems = buildMainNavItems(permissions).map((item) => {
        if (item.title === 'Actualités' && canApproveArticles) {
            return { ...item, badge: articlesPendingCount };
        }
        if (item.title === 'Conseils' && canApproveConseils) {
            return { ...item, badge: securityTipsPendingCount };
        }
        if (item.title === 'Candidatures agents') {
            return {
                ...item,
                badge: securityAgentApplicationsPendingCount,
            };
        }
        return item;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
