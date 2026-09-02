<?php

namespace Database\Seeders;

use App\Enums\MarketingCampaignChannel;
use App\Enums\MarketingCampaignSendStatus;
use App\Enums\MarketingCampaignStatus;
use App\Enums\MarketingMessageTemplateChannel;
use App\Enums\UserRole;
use App\Enums\WhatsAppAccountDriver;
use App\Models\MarketingCampaign;
use App\Models\MarketingCampaignSend;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use App\Models\MarketingMessageTemplate;
use App\Models\User;
use App\Models\WhatsAppAccount;
use App\Support\SeedLexicalContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MarketingSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::query()
            ->where('role', UserRole::Commercial)
            ->first()
            ?? User::query()->where('role', UserRole::Admin)->first()
            ?? User::query()->first();

        $this->seedWhatsAppAccount();
        $contacts = $this->seedContacts();
        $lists = $this->seedLists($contacts);
        $templates = $this->seedTemplates();
        $this->seedCampaigns($author, $lists, $templates, $contacts);
    }

    private function seedWhatsAppAccount(): void
    {
        if (WhatsAppAccount::query()->exists()) {
            return;
        }

        WhatsAppAccount::query()->create([
            'name' => 'Démo locale',
            'phone_number_id' => '000000000000000',
            'business_account_id' => null,
            'access_token' => 'demo-access-token',
            'app_secret' => 'demo-app-secret',
            'verify_token' => 'demo-verify-token',
            'driver' => WhatsAppAccountDriver::Log,
            'is_active' => true,
            'is_default' => true,
        ]);
    }

    /**
     * @return array<string, MarketingContact>
     */
    private function seedContacts(): array
    {
        $contacts = [];

        foreach ($this->contactDefinitions() as $definition) {
            $key = $definition['email'] ?? ($definition['phone'].'|'.$definition['last_name']);

            $contact = MarketingContact::query()->updateOrCreate(
                $definition['email'] !== null
                    ? ['email' => $definition['email']]
                    : ['phone' => $definition['phone'], 'last_name' => $definition['last_name']],
                [
                    'first_name' => $definition['first_name'],
                    'last_name' => $definition['last_name'],
                    'email' => $definition['email'],
                    'phone' => $definition['phone'],
                    'is_company' => $definition['is_company'],
                    'company_name' => $definition['company_name'],
                    'company_role' => $definition['company_role'],
                    'company_contacts' => $definition['company_contacts'],
                    'address' => $definition['address'],
                    'tags' => $definition['tags'],
                    'marketing_consent' => $definition['marketing_consent'],
                    'notes' => $definition['notes'],
                ],
            );

            $contacts[$key] = $contact;
        }

        return $contacts;
    }

    /**
     * @param  array<string, MarketingContact>  $contacts
     * @return array<string, MarketingList>
     */
    private function seedLists(array $contacts): array
    {
        $lists = [];

        foreach ($this->listDefinitions() as $definition) {
            $list = MarketingList::query()->updateOrCreate(
                ['name' => $definition['name']],
                ['description' => $definition['description']],
            );

            $memberIds = collect($definition['member_keys'])
                ->map(fn (string $key) => $contacts[$key]->id ?? null)
                ->filter()
                ->values()
                ->all();

            $list->contacts()->syncWithoutDetaching($memberIds);
            $lists[$definition['name']] = $list;
        }

        return $lists;
    }

    /**
     * @return array<string, MarketingMessageTemplate>
     */
    private function seedTemplates(): array
    {
        $templates = [];

        foreach ($this->templateDefinitions() as $definition) {
            $templates[$definition['name']] = MarketingMessageTemplate::query()->updateOrCreate(
                ['name' => $definition['name']],
                [
                    'channel' => MarketingMessageTemplateChannel::Email,
                    'subject' => $definition['subject'],
                    'body' => SeedLexicalContent::fromParagraphs($definition['body']),
                ],
            );
        }

        return $templates;
    }

    /**
     * @param  array<string, MarketingList>  $lists
     * @param  array<string, MarketingMessageTemplate>  $templates
     * @param  array<string, MarketingContact>  $contacts
     */
    private function seedCampaigns(
        ?User $author,
        array $lists,
        array $templates,
        array $contacts,
    ): void {
        foreach ($this->campaignDefinitions() as $definition) {
            $list = $lists[$definition['list']] ?? null;
            $template = $templates[$definition['template']] ?? null;

            if ($list === null || $template === null) {
                continue;
            }

            $campaign = MarketingCampaign::query()->updateOrCreate(
                ['name' => $definition['name']],
                [
                    'channel' => MarketingCampaignChannel::Email,
                    'status' => $definition['status'],
                    'marketing_list_id' => $list->id,
                    'marketing_message_template_id' => $template->id,
                    'subject' => $definition['subject'],
                    'body' => SeedLexicalContent::fromParagraphs($definition['body']),
                    'created_by' => $author?->id,
                    'launched_at' => $definition['launched_at'],
                    'completed_at' => $definition['completed_at'],
                ],
            );

            if ($definition['status'] === MarketingCampaignStatus::Draft) {
                continue;
            }

            if ($campaign->sends()->exists()) {
                continue;
            }

            foreach ($definition['sends'] as $sendDefinition) {
                $contact = $contacts[$sendDefinition['contact_key']] ?? null;

                if ($contact === null || blank($contact->email)) {
                    continue;
                }

                MarketingCampaignSend::query()->create([
                    'uuid' => (string) Str::uuid(),
                    'marketing_campaign_id' => $campaign->id,
                    'marketing_contact_id' => $contact->id,
                    'recipient_email' => $contact->email,
                    'recipient_name' => $contact->full_name,
                    'status' => $sendDefinition['status'],
                    'subject' => str_replace(
                        ['{{prenom}}', '{{nom}}'],
                        [$contact->first_name ?? '', $contact->last_name ?? ''],
                        $definition['subject'],
                    ),
                    'body_html' => '<p>Bonjour '.e($contact->first_name ?? '').',</p><p>'.e($definition['body'][0]).'</p>',
                    'open_token' => (string) Str::uuid(),
                    'queued_at' => $definition['launched_at']?->copy()->subMinutes(5) ?? now()->subDay(),
                    'sent_at' => $sendDefinition['sent_at'] ?? null,
                    'delivered_at' => $sendDefinition['delivered_at'] ?? null,
                    'read_at' => $sendDefinition['read_at'] ?? null,
                    'failed_at' => $sendDefinition['failed_at'] ?? null,
                    'failure_reason' => $sendDefinition['failure_reason'] ?? null,
                ]);
            }
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function contactDefinitions(): array
    {
        return [
            [
                'first_name' => 'Mamadou',
                'last_name' => 'Diallo',
                'email' => 'mamadou.diallo@akibafinance.gn',
                'phone' => '+224622100101',
                'is_company' => true,
                'company_name' => 'Akiba Finance',
                'company_role' => 'Directeur des opérations',
                'company_contacts' => [
                    ['type' => 'email', 'value' => 'compta@akibafinance.gn', 'label' => 'Comptabilité'],
                    ['type' => 'whatsapp', 'value' => '+224622100102', 'label' => 'Astreinte'],
                ],
                'address' => 'Kaloum, Conakry',
                'tags' => ['client', 'vip', 'finance'],
                'marketing_consent' => true,
                'notes' => 'Contrat gardiennage siège + agences — renouvellement T4.',
            ],
            [
                'first_name' => 'Aissatou',
                'last_name' => 'Bah',
                'email' => 'aissatou.bah@djolofchicken.gn',
                'phone' => '+224622100201',
                'is_company' => true,
                'company_name' => 'Djolof Chicken',
                'company_role' => 'Responsable sécurité',
                'company_contacts' => [
                    ['type' => 'email', 'value' => 'rh@djolofchicken.gn', 'label' => 'RH'],
                    ['type' => 'phone', 'value' => '+224622100202', 'label' => 'Standard'],
                ],
                'address' => 'Ratoma, Conakry',
                'tags' => ['client', 'restauration'],
                'marketing_consent' => true,
                'notes' => 'Intéressée par le contrôle d’accès restaurants.',
            ],
            [
                'first_name' => 'Ibrahima',
                'last_name' => 'Camara',
                'email' => 'ibrahima.camara@heroescoffee.gn',
                'phone' => '+224622100301',
                'is_company' => true,
                'company_name' => 'Heroes Coffee',
                'company_role' => 'Gérant',
                'company_contacts' => [
                    ['type' => 'whatsapp', 'value' => '+224622100301', 'label' => null],
                ],
                'address' => 'Dixinn, Conakry',
                'tags' => ['client', 'commerce'],
                'marketing_consent' => true,
                'notes' => null,
            ],
            [
                'first_name' => 'Fatoumata',
                'last_name' => 'Keita',
                'email' => 'fatoumata.keita@ashapura.gn',
                'phone' => '+224622100401',
                'is_company' => true,
                'company_name' => 'Ashapura',
                'company_role' => 'Chef de site',
                'company_contacts' => [
                    ['type' => 'email', 'value' => 'site@ashapura.gn', 'label' => 'Site'],
                    ['type' => 'phone', 'value' => '+224622100402', 'label' => 'Sécurité site'],
                ],
                'address' => 'Zone industrielle, Conakry',
                'tags' => ['client', 'industrie'],
                'marketing_consent' => true,
                'notes' => 'Besoin agents supplémentaires nuit.',
            ],
            [
                'first_name' => 'Ousmane',
                'last_name' => 'Sow',
                'email' => 'ousmane.sow@tgcc.gn',
                'phone' => '+224622100501',
                'is_company' => true,
                'company_name' => 'TGCC',
                'company_role' => 'Directeur HSE',
                'company_contacts' => [
                    ['type' => 'email', 'value' => 'hse@tgcc.gn', 'label' => 'HSE'],
                ],
                'address' => 'Lambanyi, Conakry',
                'tags' => ['prospect', 'btp'],
                'marketing_consent' => true,
                'notes' => 'Devis surveillance chantier en cours.',
            ],
            [
                'first_name' => 'Mariama',
                'last_name' => 'Sylla',
                'email' => 'mariama.sylla@bankitruck.gn',
                'phone' => '+224622100601',
                'is_company' => true,
                'company_name' => 'Banki Truck',
                'company_role' => 'Responsable flotte',
                'company_contacts' => [
                    ['type' => 'whatsapp', 'value' => '+224622100602', 'label' => 'Dispatch'],
                ],
                'address' => 'Matoto, Conakry',
                'tags' => ['prospect', 'logistique'],
                'marketing_consent' => true,
                'notes' => 'Intérêt pour escorte de convois.',
            ],
            [
                'first_name' => 'Abdoulaye',
                'last_name' => 'Touré',
                'email' => 'abdoulaye.toure@dgi.gn',
                'phone' => '+224622100701',
                'is_company' => true,
                'company_name' => 'Diare Groupe Industrie',
                'company_role' => 'Directeur général',
                'company_contacts' => [
                    ['type' => 'email', 'value' => 'secretariat@dgi.gn', 'label' => 'Secrétariat'],
                    ['type' => 'phone', 'value' => '+224622100702', 'label' => 'Accueil'],
                ],
                'address' => 'Kaloum, Conakry',
                'tags' => ['client', 'vip', 'industrie'],
                'marketing_consent' => true,
                'notes' => 'Compte stratégique — prioriser les relances.',
            ],
            [
                'first_name' => 'Sékou',
                'last_name' => 'Condé',
                'email' => 'sekou.conde@residence-almamya.gn',
                'phone' => '+224622100801',
                'is_company' => true,
                'company_name' => 'Résidence Almamya',
                'company_role' => 'Syndic',
                'company_contacts' => null,
                'address' => 'Almamya, Conakry',
                'tags' => ['client', 'résidentiel'],
                'marketing_consent' => true,
                'notes' => 'Gardiennage 24/7 — 2 postes.',
            ],
            [
                'first_name' => 'Hadja',
                'last_name' => 'Bangoura',
                'email' => 'hadja.bangoura@gmail.com',
                'phone' => '+224622100901',
                'is_company' => false,
                'company_name' => null,
                'company_role' => null,
                'company_contacts' => null,
                'address' => 'Kipé, Conakry',
                'tags' => ['prospect', 'particulier'],
                'marketing_consent' => true,
                'notes' => 'Demande devis maison individuelle.',
            ],
            [
                'first_name' => 'Alpha',
                'last_name' => 'Barry',
                'email' => 'alpha.barry@clinique-pasteur.gn',
                'phone' => '+224622101001',
                'is_company' => true,
                'company_name' => 'Clinique Pasteur',
                'company_role' => 'Administrateur',
                'company_contacts' => [
                    ['type' => 'email', 'value' => 'accueil@clinique-pasteur.gn', 'label' => 'Accueil'],
                ],
                'address' => 'Dixinn, Conakry',
                'tags' => ['prospect', 'santé'],
                'marketing_consent' => true,
                'notes' => 'Sensibles aux horaires de relève.',
            ],
            [
                'first_name' => 'Néné',
                'last_name' => 'Camara',
                'email' => null,
                'phone' => '+224622101101',
                'is_company' => false,
                'company_name' => null,
                'company_role' => null,
                'company_contacts' => null,
                'address' => 'Sonfonia, Conakry',
                'tags' => ['prospect'],
                'marketing_consent' => false,
                'notes' => 'Sans consentement e-mail — contact WhatsApp uniquement.',
            ],
            [
                'first_name' => 'Lamine',
                'last_name' => 'Fofana',
                'email' => 'lamine.fofana@hotel-kaloum.gn',
                'phone' => '+224622101201',
                'is_company' => true,
                'company_name' => 'Hôtel Kaloum',
                'company_role' => 'Directeur d’hôtel',
                'company_contacts' => [
                    ['type' => 'email', 'value' => 'reception@hotel-kaloum.gn', 'label' => 'Réception'],
                    ['type' => 'whatsapp', 'value' => '+224622101202', 'label' => 'Night manager'],
                ],
                'address' => 'Kaloum, Conakry',
                'tags' => ['client', 'hôtellerie'],
                'marketing_consent' => true,
                'notes' => 'Renouvellement contrat agents d’accueil.',
            ],
        ];
    }

    /**
     * @return list<array{name: string, description: string, member_keys: list<string>}>
     */
    private function listDefinitions(): array
    {
        return [
            [
                'name' => 'Clients actifs Conakry',
                'description' => 'Entreprises et sites déjà sous contrat à Conakry.',
                'member_keys' => [
                    'mamadou.diallo@akibafinance.gn',
                    'aissatou.bah@djolofchicken.gn',
                    'ibrahima.camara@heroescoffee.gn',
                    'fatoumata.keita@ashapura.gn',
                    'abdoulaye.toure@dgi.gn',
                    'sekou.conde@residence-almamya.gn',
                    'lamine.fofana@hotel-kaloum.gn',
                ],
            ],
            [
                'name' => 'Prospects BTP & industrie',
                'description' => 'Pistes commerciales chantiers, usines et logistique.',
                'member_keys' => [
                    'ousmane.sow@tgcc.gn',
                    'mariama.sylla@bankitruck.gn',
                    'fatoumata.keita@ashapura.gn',
                    'abdoulaye.toure@dgi.gn',
                ],
            ],
            [
                'name' => 'VIP & comptes stratégiques',
                'description' => 'Comptes à fort potentiel — suivi commercial prioritaire.',
                'member_keys' => [
                    'mamadou.diallo@akibafinance.gn',
                    'abdoulaye.toure@dgi.gn',
                    'lamine.fofana@hotel-kaloum.gn',
                ],
            ],
            [
                'name' => 'Nouveaux leads particuliers',
                'description' => 'Demandes récentes de gardiennage résidentiel.',
                'member_keys' => [
                    'hadja.bangoura@gmail.com',
                    '+224622101101|Camara',
                ],
            ],
        ];
    }

    /**
     * @return list<array{name: string, subject: string, body: list<string>}>
     */
    private function templateDefinitions(): array
    {
        return [
            [
                'name' => 'Présentation Super Sécurité',
                'subject' => '{{prenom}}, sécurisez votre site avec Super Sécurité',
                'body' => [
                    'Bonjour {{prenom}} {{nom}},',
                    'Super Sécurité accompagne les entreprises et résidences en Guinée avec des dispositifs de gardiennage, de contrôle d’accès et de supervision adaptés à chaque site.',
                    'Nous intervenons à Conakry et sur les sites industriels avec des agents formés, un encadrement de proximité et un reporting clair.',
                    'Souhaitez-vous un devis personnalisé pour {{entreprise}} ? Notre équipe commerciale reste à votre disposition au +224 612 13 13 14.',
                    'Cordialement, L’équipe Super Sécurité',
                ],
            ],
            [
                'name' => 'Relance devis en attente',
                'subject' => 'Votre devis Super Sécurité — {{entreprise}}',
                'body' => [
                    'Bonjour {{prenom}},',
                    'Nous revenons vers vous concernant la proposition de services de sécurité pour {{entreprise}}.',
                    'Si vous avez des questions sur les effectifs, les horaires ou le contrôle d’accès, nous pouvons organiser un passage sur site sous 48 h.',
                    'Répondez simplement à cet e-mail ou contactez-nous au +224 612 13 13 14.',
                    'Bien à vous, Service commercial — Super Sécurité',
                ],
            ],
            [
                'name' => 'Newsletter conseils sécurité',
                'subject' => '3 gestes simples pour renforcer la sécurité de votre site',
                'body' => [
                    'Bonjour {{prenom}},',
                    'Voici trois bonnes pratiques que nous recommandons à nos clients : contrôler systématiquement les badges, consignes écrites à chaque poste, et remontée immédiate des anomalies au superviseur.',
                    'Ces mesures réduisent les incidents et améliorent la traçabilité des interventions.',
                    'Pour un audit express de votre site ({{adresse}}), contactez Super Sécurité.',
                    'L’équipe Super Sécurité',
                ],
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function campaignDefinitions(): array
    {
        $launched = now()->subDays(5)->setTime(9, 15);
        $completed = now()->subDays(4)->setTime(11, 40);

        return [
            [
                'name' => 'Campagne présentation Q3 — clients actifs',
                'list' => 'Clients actifs Conakry',
                'template' => 'Présentation Super Sécurité',
                'status' => MarketingCampaignStatus::Completed,
                'subject' => '{{prenom}}, sécurisez votre site avec Super Sécurité',
                'body' => [
                    'Bonjour {{prenom}} {{nom}},',
                    'Merci de votre confiance. Voici un rappel de nos services de gardiennage et de supervision pour {{entreprise}}.',
                    'Notre équipe reste disponible pour ajuster votre dispositif.',
                    'Cordialement, Super Sécurité',
                ],
                'launched_at' => $launched,
                'completed_at' => $completed,
                'sends' => [
                    [
                        'contact_key' => 'mamadou.diallo@akibafinance.gn',
                        'status' => MarketingCampaignSendStatus::Read,
                        'sent_at' => $launched->copy()->addMinutes(2),
                        'delivered_at' => $launched->copy()->addMinutes(3),
                        'read_at' => $launched->copy()->addHours(2),
                    ],
                    [
                        'contact_key' => 'aissatou.bah@djolofchicken.gn',
                        'status' => MarketingCampaignSendStatus::Received,
                        'sent_at' => $launched->copy()->addMinutes(2),
                        'delivered_at' => $launched->copy()->addMinutes(4),
                    ],
                    [
                        'contact_key' => 'ibrahima.camara@heroescoffee.gn',
                        'status' => MarketingCampaignSendStatus::Read,
                        'sent_at' => $launched->copy()->addMinutes(3),
                        'delivered_at' => $launched->copy()->addMinutes(5),
                        'read_at' => $launched->copy()->addDay(),
                    ],
                    [
                        'contact_key' => 'fatoumata.keita@ashapura.gn',
                        'status' => MarketingCampaignSendStatus::Received,
                        'sent_at' => $launched->copy()->addMinutes(3),
                        'delivered_at' => $launched->copy()->addMinutes(6),
                    ],
                    [
                        'contact_key' => 'abdoulaye.toure@dgi.gn',
                        'status' => MarketingCampaignSendStatus::Failed,
                        'sent_at' => null,
                        'failed_at' => $launched->copy()->addMinutes(8),
                        'failure_reason' => 'Boîte distante indisponible temporairement.',
                    ],
                    [
                        'contact_key' => 'sekou.conde@residence-almamya.gn',
                        'status' => MarketingCampaignSendStatus::Read,
                        'sent_at' => $launched->copy()->addMinutes(4),
                        'delivered_at' => $launched->copy()->addMinutes(5),
                        'read_at' => $launched->copy()->addHours(6),
                    ],
                    [
                        'contact_key' => 'lamine.fofana@hotel-kaloum.gn',
                        'status' => MarketingCampaignSendStatus::Sent,
                        'sent_at' => $launched->copy()->addMinutes(5),
                    ],
                ],
            ],
            [
                'name' => 'Relance devis BTP & industrie',
                'list' => 'Prospects BTP & industrie',
                'template' => 'Relance devis en attente',
                'status' => MarketingCampaignStatus::Draft,
                'subject' => 'Votre devis Super Sécurité — {{entreprise}}',
                'body' => [
                    'Bonjour {{prenom}},',
                    'Nous revenons vers vous concernant la proposition pour {{entreprise}}.',
                    'Pouvons-nous planifier une visite de site cette semaine ?',
                    'Service commercial — Super Sécurité',
                ],
                'launched_at' => null,
                'completed_at' => null,
                'sends' => [],
            ],
            [
                'name' => 'Newsletter conseils sécurité — août',
                'list' => 'VIP & comptes stratégiques',
                'template' => 'Newsletter conseils sécurité',
                'status' => MarketingCampaignStatus::Completed,
                'subject' => '3 gestes simples pour renforcer la sécurité de votre site',
                'body' => [
                    'Bonjour {{prenom}},',
                    'Trois gestes simples : badges, consignes écrites, remontée d’anomalies.',
                    'Super Sécurité reste à vos côtés.',
                ],
                'launched_at' => now()->subDays(12)->setTime(8, 0),
                'completed_at' => now()->subDays(12)->setTime(8, 20),
                'sends' => [
                    [
                        'contact_key' => 'mamadou.diallo@akibafinance.gn',
                        'status' => MarketingCampaignSendStatus::Read,
                        'sent_at' => now()->subDays(12)->setTime(8, 2),
                        'delivered_at' => now()->subDays(12)->setTime(8, 3),
                        'read_at' => now()->subDays(12)->setTime(10, 15),
                    ],
                    [
                        'contact_key' => 'abdoulaye.toure@dgi.gn',
                        'status' => MarketingCampaignSendStatus::Received,
                        'sent_at' => now()->subDays(12)->setTime(8, 2),
                        'delivered_at' => now()->subDays(12)->setTime(8, 4),
                    ],
                    [
                        'contact_key' => 'lamine.fofana@hotel-kaloum.gn',
                        'status' => MarketingCampaignSendStatus::Bounced,
                        'sent_at' => now()->subDays(12)->setTime(8, 2),
                        'failed_at' => now()->subDays(12)->setTime(8, 5),
                        'failure_reason' => 'Adresse rejetée par le serveur distant.',
                    ],
                ],
            ],
        ];
    }
}
