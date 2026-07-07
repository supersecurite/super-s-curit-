<?php

namespace App\Enums;

enum BackofficePermission: string
{
    case DashboardView = 'dashboard.view';

    case ArticlesView = 'articles.view';
    case ArticlesCreate = 'articles.create';
    case ArticlesUpdate = 'articles.update';
    case ArticlesUpdateAny = 'articles.update_any';
    case ArticlesDelete = 'articles.delete';
    case ArticlesDeleteAny = 'articles.delete_any';
    case ArticlesApprove = 'articles.approve';
    case ArticlesFeature = 'articles.feature';

    case ConseilsView = 'conseils.view';
    case ConseilsCreate = 'conseils.create';
    case ConseilsUpdate = 'conseils.update';
    case ConseilsUpdateAny = 'conseils.update_any';
    case ConseilsDelete = 'conseils.delete';
    case ConseilsDeleteAny = 'conseils.delete_any';
    case ConseilsApprove = 'conseils.approve';
    case ConseilsFeature = 'conseils.feature';

    case GalleryImagesView = 'gallery_images.view';
    case GalleryImagesCreate = 'gallery_images.create';
    case GalleryImagesUpdate = 'gallery_images.update';
    case GalleryImagesDelete = 'gallery_images.delete';

    case GalleryVideosView = 'gallery_videos.view';
    case GalleryVideosCreate = 'gallery_videos.create';
    case GalleryVideosUpdate = 'gallery_videos.update';
    case GalleryVideosDelete = 'gallery_videos.delete';

    case AnalyticsView = 'analytics.view';

    case AgentApplicationsView = 'agent_applications.view';
    case AgentApplicationsUpdate = 'agent_applications.update';

    case UsersView = 'users.view';
    case UsersCreate = 'users.create';
    case UsersUpdate = 'users.update';
    case UsersDelete = 'users.delete';

    case PartnersView = 'partners.view';
    case PartnersCreate = 'partners.create';
    case PartnersUpdate = 'partners.update';
    case PartnersDelete = 'partners.delete';

    public function feature(): string
    {
        return explode('.', $this->value, 2)[0];
    }

    public function action(): string
    {
        return explode('.', $this->value, 2)[1];
    }

    public function groupLabel(): string
    {
        return match ($this->feature()) {
            'dashboard' => 'Tableau de bord',
            'articles' => 'Actualités',
            'conseils' => 'Conseils de sécurité',
            'gallery_images' => 'Galerie photos',
            'gallery_videos' => 'Galerie vidéos',
            'analytics' => 'Analytics',
            'agent_applications' => 'Candidatures agents',
            'users' => 'Utilisateurs',
            'partners' => 'Partenaires',
            default => $this->feature(),
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::DashboardView => 'Consulter',

            self::ArticlesView, self::ConseilsView,
            self::GalleryImagesView, self::GalleryVideosView,
            self::AnalyticsView, self::AgentApplicationsView,
            self::UsersView, self::PartnersView => 'Consulter',

            self::ArticlesCreate, self::ConseilsCreate,
            self::GalleryImagesCreate, self::GalleryVideosCreate,
            self::UsersCreate, self::PartnersCreate => 'Créer',

            self::ArticlesUpdate, self::ConseilsUpdate,
            self::GalleryImagesUpdate, self::GalleryVideosUpdate,
            self::UsersUpdate, self::PartnersUpdate,
            self::AgentApplicationsUpdate => 'Modifier',

            self::ArticlesUpdateAny, self::ConseilsUpdateAny => 'Modifier tout le contenu',

            self::ArticlesDelete, self::ConseilsDelete,
            self::GalleryImagesDelete, self::GalleryVideosDelete,
            self::UsersDelete, self::PartnersDelete => 'Supprimer le sien',

            self::ArticlesDeleteAny, self::ConseilsDeleteAny => 'Supprimer tout le contenu',

            self::ArticlesApprove, self::ConseilsApprove => 'Approuver et publier',

            self::ArticlesFeature, self::ConseilsFeature => 'Mettre en avant',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::DashboardView => 'Accéder au tableau de bord.',

            self::ArticlesView => 'Voir la liste des actualités dans le backoffice.',
            self::ArticlesCreate => 'Rédiger de nouvelles actualités.',
            self::ArticlesUpdate => 'Modifier ses propres actualités.',
            self::ArticlesUpdateAny => 'Modifier toutes les actualités, quel que soit l\'auteur.',
            self::ArticlesDelete => 'Supprimer ses propres actualités non publiées.',
            self::ArticlesDeleteAny => 'Supprimer n\'importe quelle actualité.',
            self::ArticlesApprove => 'Approuver, rejeter et changer le statut de publication.',
            self::ArticlesFeature => 'Mettre une actualité en avant sur le site.',

            self::ConseilsView => 'Voir la liste des conseils dans le backoffice.',
            self::ConseilsCreate => 'Rédiger de nouveaux conseils.',
            self::ConseilsUpdate => 'Modifier ses propres conseils.',
            self::ConseilsUpdateAny => 'Modifier tous les conseils, quel que soit l\'auteur.',
            self::ConseilsDelete => 'Supprimer ses propres conseils non publiés.',
            self::ConseilsDeleteAny => 'Supprimer n\'importe quel conseil.',
            self::ConseilsApprove => 'Approuver, rejeter et changer le statut de publication.',
            self::ConseilsFeature => 'Mettre un conseil en avant sur le site.',

            self::GalleryImagesView => 'Voir les photos de la galerie.',
            self::GalleryImagesCreate => 'Ajouter des photos à la galerie.',
            self::GalleryImagesUpdate => 'Modifier les photos existantes.',
            self::GalleryImagesDelete => 'Supprimer des photos de la galerie.',

            self::GalleryVideosView => 'Voir les vidéos de la galerie.',
            self::GalleryVideosCreate => 'Ajouter des vidéos YouTube.',
            self::GalleryVideosUpdate => 'Modifier les vidéos existantes.',
            self::GalleryVideosDelete => 'Supprimer des vidéos de la galerie.',

            self::AnalyticsView => 'Consulter les statistiques de visites.',

            self::AgentApplicationsView => 'Voir les candidatures agents.',
            self::AgentApplicationsUpdate => 'Traiter et mettre à jour les candidatures.',

            self::UsersView => 'Voir la liste des utilisateurs.',
            self::UsersCreate => 'Créer de nouveaux comptes.',
            self::UsersUpdate => 'Modifier les comptes et leurs permissions.',
            self::UsersDelete => 'Supprimer des comptes utilisateurs.',

            self::PartnersView => 'Voir la liste des partenaires.',
            self::PartnersCreate => 'Ajouter de nouveaux partenaires.',
            self::PartnersUpdate => 'Modifier les partenaires existants.',
            self::PartnersDelete => 'Supprimer des partenaires.',
        };
    }

    /**
     * @return list<self>
     */
    public static function forFeature(string $feature): array
    {
        return array_values(array_filter(
            self::cases(),
            fn (self $permission): bool => $permission->feature() === $feature,
        ));
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<array{key: string, label: string, permissions: list<array{value: string, label: string, description: string}>}>
     */
    public static function groupedOptions(): array
    {
        $groups = [];

        foreach (self::cases() as $permission) {
            $feature = $permission->feature();

            if (! isset($groups[$feature])) {
                $groups[$feature] = [
                    'key' => $feature,
                    'label' => $permission->groupLabel(),
                    'permissions' => [],
                ];
            }

            $groups[$feature]['permissions'][] = [
                'value' => $permission->value,
                'label' => $permission->label(),
                'description' => $permission->description(),
            ];
        }

        return array_values($groups);
    }

    /**
     * @return list<self>
     */
    public static function expandLegacy(string $legacy): array
    {
        return match ($legacy) {
            'dashboard' => [self::DashboardView],
            'articles' => self::forFeature('articles'),
            'conseils' => self::forFeature('conseils'),
            'gallery_images' => self::forFeature('gallery_images'),
            'gallery_videos' => self::forFeature('gallery_videos'),
            'analytics' => [self::AnalyticsView],
            'agent_applications' => self::forFeature('agent_applications'),
            'users' => self::forFeature('users'),
            'partners' => self::forFeature('partners'),
            'content_approval' => [
                self::ArticlesApprove,
                self::ArticlesFeature,
                self::ArticlesUpdateAny,
                self::ArticlesDeleteAny,
                self::ConseilsApprove,
                self::ConseilsFeature,
                self::ConseilsUpdateAny,
                self::ConseilsDeleteAny,
            ],
            default => self::tryFrom($legacy) !== null ? [self::from($legacy)] : [],
        };
    }

    /**
     * @return list<self>
     */
    public static function contributorDefaults(): array
    {
        return [
            self::DashboardView,
            self::ArticlesView,
            self::ArticlesCreate,
            self::ArticlesUpdate,
            self::ArticlesDelete,
            self::ConseilsView,
            self::ConseilsCreate,
            self::ConseilsUpdate,
            self::ConseilsDelete,
        ];
    }
}
