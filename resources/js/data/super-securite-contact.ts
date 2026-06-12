export const superSecuriteContactHeroCopy = {
    label: 'Nous contacter',
    titleLead: 'Parlons de votre',
    titleHighlight: 'sécurité',
    titleTrail: '',
    description:
        'Vous recherchez une solution de gardiennage, de surveillance ou de sécurité privée en Guinée ? Décrivez-nous vos besoins et nos équipes vous contacteront dans les plus brefs délais pour vous proposer une solution adaptée.',
} as const;

export const superSecuriteProjectTypes = [
    'Sécurité entreprise',
    'Sécurité résidence',
    'Sécurité chantiers',
    'Zones minières',
    'Vidéo / télésurveillance',
    'Autre',
] as const;

export type SuperSecuriteFaq = {
    question: string;
    answer: string;
};

export type SuperSecuriteFaqGroup = {
    title: string;
    faqs: readonly SuperSecuriteFaq[];
};

export const superSecuriteFaqGroups: readonly SuperSecuriteFaqGroup[] = [
    {
        title: 'Entreprise',
        faqs: [
            {
                question:
                    'Pourquoi faire appel à une société de sécurité privée en Guinée ?',
                answer:
                    "Faire appel à une société de sécurité privée permet de protéger vos locaux, vos équipements, vos collaborateurs et vos visiteurs. En Guinée, les entreprises font souvent face à des enjeux de contrôle d'accès, de surveillance des installations et de prévention des actes de malveillance.",
            },
            {
                question:
                    'Quels types d\'entreprises peuvent bénéficier de vos services ?',
                answer:
                    'Nous accompagnons les PME, grandes entreprises, banques, commerces, entrepôts, usines, bureaux administratifs, institutions internationales et organisations opérant en Guinée.',
            },
            {
                question:
                    'Comment vos agents assurent-ils la sécurité des sites ?',
                answer:
                    "Nos agents assurent le contrôle des accès, les rondes de surveillance, l'accueil sécuritaire des visiteurs, le suivi des mouvements sur site et l'application des consignes de sécurité définies avec le client.",
            },
            {
                question: 'Vos agents sont-ils formés ?',
                answer:
                    'Oui. Tous nos agents reçoivent une formation adaptée aux exigences du métier de la sécurité privée et sont régulièrement supervisés afin de garantir un haut niveau de professionnalisme.',
            },
            {
                question: 'Intervenez-vous en dehors de Conakry ?',
                answer:
                    'Oui. Super Sécurité intervient sur l\'ensemble du territoire guinéen selon les besoins de ses clients.',
            },
            {
                question:
                    'Comment obtenir un devis pour la sécurité de mon entreprise ?',
                answer:
                    'Nos équipes réalisent une évaluation de vos besoins afin de proposer une solution personnalisée et un devis adapté à votre activité.',
            },
            {
                question:
                    'Pourquoi choisir une société de sécurité à Conakry pour protéger son entreprise ?',
                answer:
                    "Conakry concentre une grande partie de l'activité économique de la Guinée, avec de nombreux bureaux, commerces, entrepôts et sites industriels. Faire appel à une société de sécurité implantée localement permet de bénéficier d'une meilleure réactivité, d'une connaissance du terrain et d'un accompagnement adapté aux réalités sécuritaires de la capitale guinéenne.",
            },
        ],
    },
    {
        title: 'Sécurité minière',
        faqs: [
            {
                question:
                    'Pourquoi la sécurité est-elle essentielle sur un site minier en Guinée ?',
                answer:
                    "Les sites miniers concentrent des équipements de grande valeur, des matières premières et un important flux de personnel. Une sécurité professionnelle permet de réduire les risques de vol, d'intrusion, de sabotage et d'incidents opérationnels.",
            },
            {
                question: 'Avez-vous de l\'expérience dans le secteur minier ?',
                answer:
                    'Oui. Nos équipes sont formées aux contraintes spécifiques des sites miniers et aux exigences des entreprises opérant dans ce secteur stratégique en Guinée.',
            },
            {
                question:
                    'Quels services de sécurité proposez-vous pour les mines ?',
                answer:
                    "Nous assurons le contrôle d'accès, la surveillance des installations, la protection des équipements, la gestion des visiteurs, les rondes de sécurité et la supervision opérationnelle.",
            },
            {
                question:
                    'Intervenez-vous dans les zones minières éloignées ?',
                answer:
                    "Oui. Nous pouvons déployer des équipes dans les différentes régions minières de Guinée, notamment à Boké, Boffa, Siguiri, Kankan et dans d'autres zones d'exploitation.",
            },
            {
                question:
                    'Comment assurez-vous le suivi des agents sur les sites miniers ?',
                answer:
                    'Nos superviseurs effectuent des contrôles réguliers et des rapports de suivi peuvent être transmis aux responsables du site.',
            },
            {
                question:
                    'Pouvez-vous fournir un dispositif de sécurité 24h/24 ?',
                answer:
                    'Oui. Nous mettons en place des équipes organisées en rotation afin d\'assurer une couverture permanente des sites miniers.',
            },
            {
                question:
                    'Quelle société de sécurité choisir pour un site minier à Boké ou Boffa ?',
                answer:
                    "Les régions de Boké et Boffa abritent certaines des plus importantes exploitations minières de Guinée. La sécurisation de ces sites nécessite une expertise spécifique, une capacité de déploiement en zones éloignées et une parfaite maîtrise des exigences du secteur minier. Super Sécurité accompagne les acteurs miniers avec des solutions adaptées à la protection des installations, du personnel et des équipements.",
            },
        ],
    },
    {
        title: 'Sécurité des domiciles et résidences',
        faqs: [
            {
                question:
                    'Pourquoi faire appel à une société de sécurité pour protéger son domicile ?',
                answer:
                    "La présence d'agents de sécurité contribue à dissuader les intrusions, à contrôler les accès et à renforcer la sécurité des occupants et des biens.",
            },
            {
                question: 'Quels types de résidences protégez-vous ?',
                answer:
                    'Nous assurons la sécurité des villas, résidences privées, immeubles résidentiels, résidences diplomatiques et logements de cadres ou d\'expatriés.',
            },
            {
                question:
                    'Les agents sont-ils présents de jour comme de nuit ?',
                answer:
                    'Oui. Selon les besoins du client, nous pouvons mettre en place une présence permanente ou des horaires adaptés.',
            },
            {
                question: 'Vos agents contrôlent-ils les visiteurs ?',
                answer:
                    "Oui. Nos agents peuvent assurer l'identification des visiteurs, le contrôle des entrées et sorties ainsi que le respect des consignes de sécurité du propriétaire.",
            },
            {
                question:
                    'Puis-je bénéficier d\'un service de sécurité temporaire ?',
                answer:
                    'Oui. Nous proposons aussi des prestations ponctuelles pour des absences prolongées ou des périodes à risque.',
            },
            {
                question:
                    'Comment déterminer le nombre d\'agents nécessaires ?',
                answer:
                    'Nos équipes réalisent une évaluation du domicile afin de recommander un dispositif adapté à sa configuration et aux risques identifiés.',
            },
            {
                question:
                    'Comment protéger efficacement sa villa ou sa résidence à Conakry ?',
                answer:
                    "La protection d'une résidence à Conakry repose sur plusieurs éléments : contrôle des accès, présence d'agents de sécurité qualifiés, surveillance des visiteurs et application de procédures adaptées. Une solution de sécurité professionnelle permet de renforcer la tranquillité des occupants et de prévenir les risques d'intrusion ou de vol.",
            },
        ],
    },
    {
        title: 'Sécurité de chantier',
        faqs: [
            {
                question: 'Pourquoi sécuriser un chantier en Guinée ?',
                answer:
                    'Les chantiers sont fréquemment exposés aux vols de matériaux, aux dégradations et aux intrusions. Une surveillance professionnelle permet de protéger les investissements et de limiter les interruptions de travaux.',
            },
            {
                question: 'Quels types de chantiers protégez-vous ?',
                answer:
                    'Nous intervenons sur les chantiers de construction, les projets industriels, les infrastructures publiques, les projets miniers et les programmes immobiliers.',
            },
            {
                question: 'Que font vos agents sur un chantier ?',
                answer:
                    'Ils assurent le contrôle des accès, la surveillance des matériaux et équipements, les rondes de sécurité et la gestion des entrées et sorties du personnel.',
            },
            {
                question:
                    'La surveillance est-elle assurée en dehors des heures de travail ?',
                answer:
                    'Oui. Nous proposons une surveillance de nuit, les week-ends et les jours fériés afin de garantir une protection continue.',
            },
            {
                question:
                    'Pouvez-vous intervenir rapidement sur un nouveau chantier ?',
                answer:
                    'Oui. Nos équipes peuvent être déployées rapidement selon la localisation et les besoins du projet.',
            },
            {
                question:
                    'Comment réduire les pertes liées aux vols sur les chantiers ?',
                answer:
                    "La mise en place d'un dispositif de sécurité adapté, associé à des contrôles d'accès et à une surveillance régulière, constitue la solution la plus efficace pour limiter les pertes et sécuriser les actifs du chantier.",
            },
            {
                question:
                    'Comment sécuriser un chantier de construction à Conakry et dans les grandes villes de Guinée ?',
                answer:
                    "Les chantiers de construction sont souvent exposés aux vols de matériaux, aux intrusions et aux actes de vandalisme. La mise en place d'un dispositif de sécurité adapté, comprenant le contrôle des accès, des rondes régulières et une surveillance en dehors des heures de travail, permet de protéger efficacement les investissements et d'assurer la continuité des travaux.",
            },
        ],
    },
] as const;

export const superSecuriteFaqs: readonly SuperSecuriteFaq[] =
    superSecuriteFaqGroups.flatMap((group) => group.faqs);
