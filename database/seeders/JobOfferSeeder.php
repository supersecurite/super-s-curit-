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
                'title_zh' => '保安员',
                'location' => 'Conakry',
                'location_en' => 'Conakry',
                'location_zh' => '科纳克里',
                'contract_type' => 'Temps plein',
                'contract_type_en' => 'Full time',
                'contract_type_zh' => '全职',
                'description' => "Assurer la surveillance, le contrôle d’accès et la prévention des incidents sur des sites confiés à Super Sécurité.\n\nVous interviendrez en tenue, respecterez les consignes du poste et signalerez immédiatement toute anomalie à la supervision.",
                'description_en' => "Provide surveillance, access control and incident prevention on sites entrusted to Super Sécurité.\n\nYou will work in uniform, follow post instructions and immediately report any anomaly to supervision.",
                'description_zh' => "负责监视、门禁控制以及预防 Super Sécurité 所托管场所的事故。\n\n您将统一着装执勤，遵守岗位指令，并立即向督导报告任何异常。",
            ],
            [
                'slug' => 'superviseur-de-site',
                'title' => 'Superviseur de site',
                'title_en' => 'Site supervisor',
                'title_zh' => '现场主管',
                'location' => 'Conakry',
                'location_en' => 'Conakry',
                'location_zh' => '科纳克里',
                'contract_type' => 'Temps plein',
                'contract_type_en' => 'Full time',
                'contract_type_zh' => '全职',
                'description' => "Encadrer les agents sur site, coordonner les rondes et assurer le reporting opérationnel.\n\nVous êtes le relais entre le terrain et la direction des opérations, avec une exigence forte sur la qualité de service.",
                'description_en' => "Supervise on-site officers, coordinate patrols and deliver operational reporting.\n\nYou are the link between the field and operations management, with a strong focus on service quality.",
                'description_zh' => "现场督导保安人员，协调巡逻并提交运营报告。\n\n您是现场与运营管理层之间的桥梁，对服务质量有严格要求。",
            ],
            [
                'slug' => 'responsable-securite',
                'title' => 'Responsable sécurité',
                'title_en' => 'Security manager',
                'title_zh' => '安保经理',
                'location' => 'Boké',
                'location_en' => 'Boké',
                'location_zh' => '博凯',
                'contract_type' => 'Temps plein',
                'contract_type_en' => 'Full time',
                'contract_type_zh' => '全职',
                'description' => "Piloter le dispositif de sécurité d’un périmètre sensible et assurer le lien avec le client.\n\nLe poste demande une expérience d’encadrement, une lecture fine des risques et une capacité à organiser les équipes.",
                'description_en' => "Lead the security setup for a sensitive perimeter and maintain the client relationship.\n\nThe role requires leadership experience, strong risk awareness and the ability to organize teams.",
                'description_zh' => "负责敏感区域的安保体系，并保持与客户的沟通。\n\n该岗位需要管理经验、敏锐的风险判断力以及组织团队的能力。",
            ],
            [
                'slug' => 'technicien-videosurveillance',
                'title' => 'Technicien vidéosurveillance',
                'title_en' => 'CCTV technician',
                'title_zh' => '视频监控技术员',
                'location' => 'Conakry',
                'location_en' => 'Conakry',
                'location_zh' => '科纳克里',
                'contract_type' => 'Temps plein',
                'contract_type_en' => 'Full time',
                'contract_type_zh' => '全职',
                'description' => "Exploiter et maintenir les systèmes de vidéosurveillance, alerter et documenter les événements.\n\nVous travaillez en salle de contrôle, en lien permanent avec les équipes terrain et la supervision.",
                'description_en' => "Operate and maintain CCTV systems, raise alerts and document events.\n\nYou work in the control room, in constant contact with field teams and supervision.",
                'description_zh' => "操作并维护视频监控系统，发出警报并记录事件。\n\n您在控制室工作，与现场团队和督导保持持续联系。",
            ],
        ];

        foreach ($offers as $offer) {
            JobOffer::query()->updateOrCreate(
                ['slug' => $offer['slug']],
                [
                    'title' => $offer['title'],
                    'title_en' => $offer['title_en'],
                    'title_zh' => $offer['title_zh'],
                    'location' => $offer['location'],
                    'location_en' => $offer['location_en'],
                    'location_zh' => $offer['location_zh'],
                    'contract_type' => $offer['contract_type'],
                    'contract_type_en' => $offer['contract_type_en'],
                    'contract_type_zh' => $offer['contract_type_zh'],
                    'description' => $offer['description'],
                    'description_en' => $offer['description_en'],
                    'description_zh' => $offer['description_zh'],
                    'is_active' => true,
                    'published_at' => now(),
                ],
            );
        }
    }
}
