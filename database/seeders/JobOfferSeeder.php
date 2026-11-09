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
                'title_en' => 'Security officer',
                'location' => 'Conakry',
                'location_en' => 'Conakry',
                'contract_type' => 'Temps plein',
                'contract_type_en' => 'Full time',
                'description' => "Assurer la surveillance, le contrôle d’accès et la prévention des incidents sur des sites confiés à Super Sécurité.\n\nVous interviendrez en tenue, respecterez les consignes du poste et signalerez immédiatement toute anomalie à la supervision.",
                'description_en' => "Provide surveillance, access control and incident prevention on sites entrusted to Super Sécurité.\n\nYou will work in uniform, follow post instructions and immediately report any anomaly to supervision.",
            ],
            [
                'slug' => 'superviseur-de-site',
                'title' => 'Superviseur de site',
                'title_en' => 'Site supervisor',
                'location' => 'Conakry',
                'location_en' => 'Conakry',
                'contract_type' => 'Temps plein',
                'contract_type_en' => 'Full time',
                'description' => "Encadrer les agents sur site, coordonner les rondes et assurer le reporting opérationnel.\n\nVous êtes le relais entre le terrain et la direction des opérations, avec une exigence forte sur la qualité de service.",
                'description_en' => "Supervise on-site officers, coordinate patrols and deliver operational reporting.\n\nYou are the link between the field and operations management, with a strong focus on service quality.",
            ],
            [
                'slug' => 'responsable-securite',
                'title' => 'Responsable sécurité',
                'title_en' => 'Security manager',
                'location' => 'Boké',
                'location_en' => 'Boké',
                'contract_type' => 'Temps plein',
                'contract_type_en' => 'Full time',
                'description' => "Piloter le dispositif de sécurité d’un périmètre sensible et assurer le lien avec le client.\n\nLe poste demande une expérience d’encadrement, une lecture fine des risques et une capacité à organiser les équipes.",
                'description_en' => "Lead the security setup for a sensitive perimeter and maintain the client relationship.\n\nThe role requires leadership experience, strong risk awareness and the ability to organize teams.",
            ],
            [
                'slug' => 'technicien-videosurveillance',
                'title' => 'Technicien vidéosurveillance',
                'title_en' => 'CCTV technician',
                'location' => 'Conakry',
                'location_en' => 'Conakry',
                'contract_type' => 'Temps plein',
                'contract_type_en' => 'Full time',
                'description' => "Exploiter et maintenir les systèmes de vidéosurveillance, alerter et documenter les événements.\n\nVous travaillez en salle de contrôle, en lien permanent avec les équipes terrain et la supervision.",
                'description_en' => "Operate and maintain CCTV systems, raise alerts and document events.\n\nYou work in the control room, in constant contact with field teams and supervision.",
            ],
        ];

        foreach ($offers as $offer) {
            JobOffer::query()->updateOrCreate(
                ['slug' => $offer['slug']],
                [
                    'title' => $offer['title'],
                    'title_en' => $offer['title_en'],
                    'location' => $offer['location'],
                    'location_en' => $offer['location_en'],
                    'contract_type' => $offer['contract_type'],
                    'contract_type_en' => $offer['contract_type_en'],
                    'description' => $offer['description'],
                    'description_en' => $offer['description_en'],
                    'is_active' => true,
                    'published_at' => now(),
                ],
            );
        }
    }
}
