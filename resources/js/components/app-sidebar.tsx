import { Link, usePage } from '@inertiajs/react';
import { BarChart3, BookOpen, FolderGit2, Handshake, Images, LayoutGrid, Newspaper, Shield, UserPlus, Users, Video } from 'lucide-react';
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

function buildMainNavItems(isAdmin: boolean): NavItem[] {
    const items: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Actualités',
            href: articlesIndex.url(),
            icon: Newspaper,
        },
        {
            title: 'Conseils',
            href: conseilsIndex.url(),
            icon: Shield,
        },
        {
            title: 'Galerie',
            href: galleryImagesIndex.url(),
            icon: Images,
        },
        {
            title: 'Vidéos galerie',
            href: galleryVideosIndex.url(),
            icon: Video,
        },
    ];

    if (isAdmin) {
        items.push({
            title: 'Analytics',
            href: analyticsIndex.url(),
            icon: BarChart3,
        });
        items.push({
            title: 'Candidatures agents',
            href: candidaturesAgentsIndex.url(),
            icon: UserPlus,
        });
        items.push({
            title: 'Utilisateurs',
            href: usersIndex.url(),
            icon: Users,
        });
        items.push({
            title: 'Partenaires',
            href: partnersIndex.url(),
            icon: Handshake,
        });
    }

    return items;
}

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

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
    const mainNavItems = buildMainNavItems(auth.user?.is_admin ?? false).map(
        (item) => {
            if (item.title === 'Actualités' && (auth.user?.is_admin ?? false)) {
                return { ...item, badge: articlesPendingCount };
            }
            if (item.title === 'Conseils' && (auth.user?.is_admin ?? false)) {
                return { ...item, badge: securityTipsPendingCount };
            }
            if (item.title === 'Candidatures agents') {
                return { ...item, badge: securityAgentApplicationsPendingCount };
            }
            return item;
        },
    );

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
