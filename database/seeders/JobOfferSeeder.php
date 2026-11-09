<?php

namespace Database\Seeders;

use App\Models\JobOffer;
use Illuminate\Database\Seeder;

class JobOfferSeeder extends Seeder
{
    public function run(): void
    {
        $offers = [
            [
                'slug' => 'agent-de-securite',
                'title' => 'Agent de sécurité',
                'location' => 'Conakry',
                'contract_type' => 'Temps plein',
                'description' => "Assurer la surveillance, le contrôle d’accès et la prévention des incidents sur des sites confiés à Super Sécurité.\n\nVous interviendrez en tenue, respecterez les consignes du poste et signalerez immédiatement toute anomalie à la supervision.",
            ],
            [
                'slug' => 'superviseur-de-site',
                'title' => 'Superviseur de site',
                'location' => 'Conakry',
                'contract_type' => 'Temps plein',
                'description' => "Encadrer les agents sur site, coordonner les rondes et assurer le reporting opérationnel.\n\nVous êtes le relais entre le terrain et la direction des opérations, avec une exigence forte sur la qualité de service.",
            ],
            [
                'slug' => 'responsable-securite',
                'title' => 'Responsable sécurité',
                'location' => 'Boké',
                'contract_type' => 'Temps plein',
                'description' => "Piloter le dispositif de sécurité d’un périmètre sensible et assurer le lien avec le client.\n\nLe poste demande une expérience d’encadrement, une lecture fine des risques et une capacité à organiser les équipes.",
            ],
            [
                'slug' => 'technicien-videosurveillance',
                'title' => 'Technicien vidéosurveillance',
                'location' => 'Conakry',
                'contract_type' => 'Temps plein',
                'description' => "Exploiter et maintenir les systèmes de vidéosurveillance, alerter et documenter les événements.\n\nVous travaillez en salle de contrôle, en lien permanent avec les équipes terrain et la supervision.",
            ],
        ];

        foreach ($offers as $offer) {
            JobOffer::query()->updateOrCreate(
                ['slug' => $offer['slug']],
                [
                    'title' => $offer['title'],
                    'location' => $offer['location'],
                    'contract_type' => $offer['contract_type'],
                    'description' => $offer['description'],
                    'is_active' => true,
                    'published_at' => now(),
                ],
            );
        }
    }
}
