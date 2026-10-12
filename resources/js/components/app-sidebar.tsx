import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Contact,
    Globe,
    Handshake,
    History,
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
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar';
import { useTrans } from '@/hooks/use-trans';
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
import { index as marketingCampaignsIndex } from '@/routes/marketing-campaigns';
import { index as marketingTemplatesIndex } from '@/routes/marketing-templates';
import { index as marketingEmailAccountsIndex } from '@/routes/marketing-email-accounts';
import { index as marketingWhatsAppAccountsIndex } from '@/routes/marketing-whatsapp-accounts';
import { index as accessLogsIndex } from '@/routes/access-logs';
import type { Auth, NavGroup, NavItem } from '@/types';

function hasFeatureAccess(permissions: string[], feature: string): boolean {
    return permissions.some((permission) =>
        permission.startsWith(`${feature}.`),
    );
}

type Translate = (key: string, fallback?: string) => string;

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
    t: Translate,
): NavGroup[] {
    const groups: NavGroup[] = [];
    const articlesLabel = t('nav.articles', 'Actualités');
    const tipsLabel = t('nav.tips', 'Conseils');
    const photosLabel = t('nav.photos', 'Photos');
    const usersLabel = t('nav.users', 'Utilisateurs');
    const partnersLabel = t('nav.partners', 'Partenaires');

    if (hasFeatureAccess(permissions, 'dashboard')) {
        groups.push({
            title: t('nav.overview', "Vue d'ensemble"),
            items: [
                {
                    title: t('nav.dashboard', 'Dashboard'),
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ],
        });
    }

    const editorialChildren: NavItem[] = [];

    if (hasFeatureAccess(permissions, 'articles')) {
        editorialChildren.push({
            title: articlesLabel,
            href: articlesIndex.url(),
            ...(canApprove.articles && badges.articles > 0
                ? { badge: badges.articles }
                : {}),
        });
    }

    if (hasFeatureAccess(permissions, 'conseils')) {
        editorialChildren.push({
            title: tipsLabel,
            href: conseilsIndex.url(),
            ...(canApprove.conseils && badges.conseils > 0
                ? { badge: badges.conseils }
                : {}),
        });
    }

    if (editorialChildren.length > 1) {
        groups.push({
            title: t('nav.content', 'Contenu'),
            items: [
                {
                    title: t('nav.editorial', 'Éditorial'),
                    icon: Newspaper,
                    children: editorialChildren,
                },
            ],
        });
    } else if (editorialChildren.length === 1) {
        const [item] = editorialChildren;

        groups.push({
            title: t('nav.content', 'Contenu'),
            items: [
                {
                    ...item,
                    icon: item.title === articlesLabel ? Newspaper : Shield,
                },
            ],
        });
    }

    const galleryChildren: NavItem[] = [];

    if (hasFeatureAccess(permissions, 'gallery_images')) {
        galleryChildren.push({
            title: photosLabel,
            href: galleryImagesIndex.url(),
        });
    }

    if (hasFeatureAccess(permissions, 'gallery_videos')) {
        galleryChildren.push({
            title: t('nav.videos', 'Vidéos'),
            href: galleryVideosIndex.url(),
        });
    }

    if (galleryChildren.length > 1) {
        groups.push({
            title: t('nav.media', 'Médias'),
            items: [
                {
                    title: t('nav.gallery', 'Galerie'),
                    icon: Images,
                    children: galleryChildren,
                },
            ],
        });
    } else if (galleryChildren.length === 1) {
        const [item] = galleryChildren;

        groups.push({
            title: t('nav.media', 'Médias'),
            items: [
                {
                    ...item,
                    icon: item.title === photosLabel ? Images : Video,
                },
            ],
        });
    }

    const adminChildren: NavItem[] = [];

    if (hasFeatureAccess(permissions, 'users')) {
        adminChildren.push({
            title: usersLabel,
            href: usersIndex.url(),
        });
    }

    if (hasFeatureAccess(permissions, 'partners')) {
        adminChildren.push({
            title: partnersLabel,
            href: partnersIndex.url(),
        });
    }

    if (hasFeatureAccess(permissions, 'agent_applications')) {
        adminChildren.push({
            title: t('nav.agent_applications', 'Candidatures agents'),
            href: candidaturesAgentsIndex.url(),
            ...(badges.candidatures > 0
                ? { badge: badges.candidatures }
                : {}),
        });
    }

    if (adminChildren.length > 1) {
        groups.push({
            title: t('nav.administration', 'Administration'),
            items: [
                {
                    title: t('nav.management', 'Gestion'),
                    icon: Users,
                    children: adminChildren,
                },
            ],
        });
    } else if (adminChildren.length === 1) {
        const [item] = adminChildren;

        groups.push({
            title: t('nav.administration', 'Administration'),
            items: [
                {
                    ...item,
                    icon:
                        item.title === usersLabel
                            ? Users
                            : item.title === partnersLabel
                              ? Handshake
                              : UserPlus,
                },
            ],
        });
    }

    const marketingChildren: NavItem[] = [];

    if (hasFeatureAccess(permissions, 'marketing_clients')) {
        marketingChildren.push({
            title: t('nav.contacts', 'Contacts'),
            href: marketingClientsIndex.url(),
        });
        marketingChildren.push({
            title: t('nav.lists', 'Groupes'),
            href: marketingListsIndex.url(),
        });
    }

    if (hasFeatureAccess(permissions, 'marketing_campaigns')) {
        marketingChildren.push({
            title: t('nav.email', 'E-mail'),
            isSectionLabel: true,
        });
        marketingChildren.push({
            title: t('nav.templates', 'Templates'),
            href: marketingTemplatesIndex.url({ query: { channel: 'email' } }),
        });
        marketingChildren.push({
            title: t('nav.campaigns', 'Campagnes'),
            href: marketingCampaignsIndex.url({ query: { channel: 'email' } }),
        });
        marketingChildren.push({
            title: t('nav.accounts', 'Comptes'),
            href: marketingEmailAccountsIndex.url(),
        });
        marketingChildren.push({
            title: t('nav.whatsapp', 'WhatsApp'),
            isSectionLabel: true,
        });
        marketingChildren.push({
            title: t('nav.templates', 'Templates'),
            href: marketingTemplatesIndex.url({ query: { channel: 'whatsapp' } }),
        });
        marketingChildren.push({
            title: t('nav.campaigns', 'Campagnes'),
            href: marketingCampaignsIndex.url({ query: { channel: 'whatsapp' } }),
        });
        marketingChildren.push({
            title: t('nav.accounts', 'Comptes'),
            href: marketingWhatsAppAccountsIndex.url(),
        });
    }

    if (marketingChildren.length > 0) {
        groups.push({
            title: t('nav.marketing', 'Marketing'),
            items: [
                marketingChildren.length > 1
                    ? {
                          title: t('nav.marketing', 'Marketing'),
                          icon: Contact,
                          children: marketingChildren,
                      }
                    : {
                          ...marketingChildren.find((item) => !item.isSectionLabel)!,
                          icon: Contact,
                      },
            ],
        });
    }

    if (hasFeatureAccess(permissions, 'analytics') || hasFeatureAccess(permissions, 'access_logs')) {
        const insightItems: NavItem[] = [];

        if (hasFeatureAccess(permissions, 'analytics')) {
            insightItems.push({
                title: t('nav.analytics', 'Analytics'),
                href: analyticsIndex.url(),
                icon: BarChart3,
            });
        }

        if (hasFeatureAccess(permissions, 'access_logs')) {
            insightItems.push({
                title: t('nav.access_logs', "Journal d'accès"),
                href: accessLogsIndex.url(),
                icon: History,
            });
        }

        groups.push({
            title: t('nav.insights', 'Insights'),
            items: insightItems,
        });
    }

    return groups;
}

export function AppSidebar() {
    const { isMobile, setOpenMobile } = useSidebar();
    const { t } = useTrans();
    const {
        auth,
        articlesPendingCount = 0,
        securityTipsPendingCount = 0,
        securityAgentApplicationsPendingCount = 0,
    } = usePage<SidebarPageProps>().props;

    const permissions = auth.user?.permissions ?? [];
    const canApproveArticles = auth.user?.can_approve_articles ?? false;
    const canApproveConseils = auth.user?.can_approve_conseils ?? false;

    const footerNavItems: NavItem[] = [
        {
            title: t('nav.website', 'Site web'),
            href: home(),
            icon: Globe,
        },
    ];

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
        t,
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
