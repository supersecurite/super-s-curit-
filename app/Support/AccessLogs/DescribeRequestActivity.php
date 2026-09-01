<?php

namespace App\Support\AccessLogs;

use App\Enums\AccessLogKind;
use App\Models\Article;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Models\SecurityAgentApplication;
use App\Models\SecurityTip;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Transforme une requête HTTP authentifiée en phrase de journal lisible.
 *
 * Contexte : appelé par `RecordAccessLog` après une réponse 2xx/3xx réussie.
 */
final class DescribeRequestActivity
{
    /**
     * @var array<string, array{the: string, the_plural: string, person?: bool}>
     */
    private const RESOURCES = [
        'dashboard' => ['the' => 'le tableau de bord', 'the_plural' => 'le tableau de bord'],
        'articles' => ['the' => 'l\'actualité', 'the_plural' => 'les actualités'],
        'conseils' => ['the' => 'le conseil de sécurité', 'the_plural' => 'les conseils de sécurité'],
        'gallery-images' => ['the' => 'la photo de galerie', 'the_plural' => 'les photos de galerie'],
        'gallery-videos' => ['the' => 'la vidéo de galerie', 'the_plural' => 'les vidéos de galerie'],
        'partners' => ['the' => 'le partenaire', 'the_plural' => 'les partenaires'],
        'users' => ['the' => 'l\'utilisateur', 'the_plural' => 'les utilisateurs', 'person' => true],
        'candidatures-agents' => ['the' => 'la candidature agent', 'the_plural' => 'les candidatures agents'],
        'analytics' => ['the' => 'les statistiques de visites', 'the_plural' => 'les statistiques de visites'],
        'marketing-clients' => ['the' => 'le contact marketing', 'the_plural' => 'les contacts marketing', 'person' => true],
        'marketing-lists' => ['the' => 'la liste marketing', 'the_plural' => 'les listes marketing'],
        'access-logs' => ['the' => 'le journal d\'accès', 'the_plural' => 'le journal d\'accès'],
        'settings' => ['the' => 'ses paramètres', 'the_plural' => 'ses paramètres'],
    ];

    /**
     * @return array{kind: AccessLogKind, description: string}|null
     */
    public function describe(Request $request, User $actor): ?array
    {
        $routeName = $request->route()?->getName();
        $method = strtoupper($request->method());

        if ($special = $this->specialCase($request, $actor, $routeName, $method)) {
            return $special;
        }

        $action = $this->routeAction($routeName);
        $resource = $this->resourceMeta($routeName);
        $subject = $this->subjectLabel($request);
        $kind = $this->isMutation($method, $action)
            ? AccessLogKind::Action
            : AccessLogKind::Visit;

        $clause = $this->verbClause($action, $resource, $subject, $kind, $request);
        $description = $this->sentence($actor->name, $clause);

        return [
            'kind' => $kind,
            'description' => Str::limit($description, 500),
        ];
    }

    /**
     * @return array{kind: AccessLogKind, description: string}|null
     */
    private function specialCase(Request $request, User $actor, ?string $routeName, string $method): ?array
    {
        $name = $actor->name !== '' ? $actor->name : 'Un utilisateur';

        return match ($routeName) {
            'login', 'login.store' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence($name, 's\'est connecté'),
            ],
            'logout' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence($name, 's\'est déconnecté'),
            ],
            'user-password.update' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence($name, 'a modifié son mot de passe'),
            ],
            'profile.update' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence($name, 'a modifié son profil'),
            ],
            'profile.destroy' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence($name, 'a demandé la suppression de son compte'),
            ],
            'marketing-clients.import.store' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence($name, 'a importé des contacts marketing (CSV)'),
            ],
            'marketing-lists.contacts.attach' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence(
                    $name,
                    'a ajouté un contact à la liste'.$this->quoted($this->subjectLabel($request)),
                ),
            ],
            'marketing-lists.contacts.detach' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence(
                    $name,
                    'a retiré un contact de la liste'.$this->quoted($this->subjectLabel($request)),
                ),
            ],
            'users.send-welcome' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence(
                    $name,
                    'a renvoyé l\'e-mail de bienvenue à '.$this->subjectLabel($request),
                ),
            ],
            'users.send-password-reset' => [
                'kind' => AccessLogKind::Action,
                'description' => $this->sentence(
                    $name,
                    'a envoyé un lien de réinitialisation à '.$this->subjectLabel($request),
                ),
            ],
            default => $method === 'GET' && $routeName === 'dashboard'
                ? [
                    'kind' => AccessLogKind::Visit,
                    'description' => $this->sentence($name, 'a consulté le tableau de bord'),
                ]
                : null,
        };
    }

    /**
     * @param  array{the: string, the_plural: string, person?: bool}  $resource
     */
    private function verbClause(
        string $action,
        array $resource,
        ?string $subject,
        AccessLogKind $kind,
        Request $request,
    ): string {
        $the = $resource['the'];
        $plural = $resource['the_plural'];
        $quoted = $this->quoted($subject);
        $person = $resource['person'] ?? false;

        if ($kind === AccessLogKind::Visit) {
            return match ($action) {
                'create', 'import' => 'a ouvert le formulaire de création de '.$the,
                'edit' => 'a ouvert le formulaire de modification de '.$the.$quoted,
                'show' => 'a consulté '.$the.$quoted,
                default => 'a consulté '.$plural,
            };
        }

        $createdLabel = $subject ?? $this->labelFromInput($request);

        return match ($action) {
            'store', 'import.store' => 'a créé '.$the.$this->quoted($createdLabel),
            'update' => $person
                ? 'a modifié les informations de '.$the.$quoted
                : 'a modifié '.$the.$quoted,
            'destroy', 'detach' => 'a supprimé '.$the.$quoted,
            'attach' => 'a ajouté un élément à '.$the.$quoted,
            default => 'a effectué une action sur '.$the.$quoted,
        };
    }

    /**
     * @return array{the: string, the_plural: string, person?: bool}
     */
    private function resourceMeta(?string $routeName): array
    {
        $key = $this->resourceKey($routeName);

        return self::RESOURCES[$key] ?? [
            'the' => 'la ressource',
            'the_plural' => 'la ressource',
        ];
    }

    private function resourceKey(?string $routeName): string
    {
        if ($routeName === null || $routeName === '') {
            return '';
        }

        $withoutAction = preg_replace('/\.[^.]+$/', '', $routeName) ?? $routeName;

        foreach (array_keys(self::RESOURCES) as $resource) {
            if (str_starts_with($withoutAction, $resource) || str_contains($withoutAction, $resource)) {
                return $resource;
            }
        }

        $segment = Str::afterLast($withoutAction, '.');

        return match (true) {
            str_contains($withoutAction, 'marketing-clients') => 'marketing-clients',
            str_contains($withoutAction, 'marketing-lists') => 'marketing-lists',
            str_contains($withoutAction, 'candidatures-agents') => 'candidatures-agents',
            str_contains($withoutAction, 'gallery-images') => 'gallery-images',
            str_contains($withoutAction, 'gallery-videos') => 'gallery-videos',
            str_contains($withoutAction, 'profile'), str_contains($withoutAction, 'security'), str_contains($withoutAction, 'settings') => 'settings',
            default => $segment,
        };
    }

    private function routeAction(?string $routeName): string
    {
        if ($routeName === null || ! str_contains($routeName, '.')) {
            return $routeName ?? 'index';
        }

        return Str::afterLast($routeName, '.');
    }

    private function isMutation(string $method, string $action): bool
    {
        if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return true;
        }

        return in_array($action, ['store', 'update', 'destroy', 'attach', 'detach', 'import'], true);
    }

    private function subjectLabel(Request $request): ?string
    {
        $model = $this->firstBoundModel($request);

        if ($model instanceof Model) {
            return $this->modelLabel($model);
        }

        return $this->labelFromInput($request);
    }

    private function firstBoundModel(Request $request): ?Model
    {
        foreach ($request->route()?->parameters() ?? [] as $value) {
            if ($value instanceof Model) {
                return $value;
            }
        }

        return null;
    }

    private function modelLabel(Model $model): ?string
    {
        if ($model instanceof User) {
            return $model->name !== '' ? $model->name : $model->email;
        }

        if ($model instanceof MarketingContact) {
            $name = trim($model->first_name.' '.$model->last_name);

            return $name !== '' ? $name : ($model->email ?? $model->phone);
        }

        if ($model instanceof MarketingList) {
            return $model->name;
        }

        if ($model instanceof Article || $model instanceof SecurityTip) {
            return $model->title;
        }

        if ($model instanceof SecurityAgentApplication) {
            return trim($model->first_name.' '.$model->last_name) ?: $model->email;
        }

        foreach (['name', 'title', 'label'] as $attr) {
            $value = $model->getAttribute($attr);
            if (is_string($value) && $value !== '') {
                return $value;
            }
        }

        return null;
    }

    private function labelFromInput(Request $request): ?string
    {
        $name = trim((string) $request->input('name', ''));
        if ($name !== '') {
            return $name;
        }

        $last = trim((string) $request->input('last_name', ''));
        $first = trim((string) $request->input('first_name', ''));
        $combo = trim($first.' '.$last);
        if ($combo !== '') {
            return $combo;
        }

        foreach (['title', 'subject', 'label'] as $key) {
            $value = trim((string) $request->input($key, ''));
            if ($value !== '') {
                return $value;
            }
        }

        return null;
    }

    private function quoted(?string $label): string
    {
        if ($label === null || $label === '') {
            return '';
        }

        return ' « '.$label.' »';
    }

    private function sentence(string $actor, string $clause): string
    {
        $actor = trim($actor) !== '' ? trim($actor) : 'Un utilisateur';
        $clause = rtrim($clause, " \t.");

        return $actor.' '.$clause.'.';
    }
}
