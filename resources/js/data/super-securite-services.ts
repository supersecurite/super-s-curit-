import { superSecuriteServices } from '@/data/super-securite-content';
import { superSecuriteZoneLabel } from '@/data/super-securite-zone';
import type {
    MarketingPageHeroStat,
    MarketingPageHeroUnderline,
} from '@/data/marketing-page-heroes';
import { superSecuriteStock } from '@/data/super-securite-stock';

export type SuperSecuriteServiceId =
    | 'entreprise'
    | 'residence'
    | 'chantiers'
    | 'zones-minieres';

export type SuperSecuriteServiceSection = {
    title: string;
    description: string;
};

export type SuperSecuriteServiceGalleryImage = {
    src: string;
    alt: string;
    caption?: string;
};

export type SuperSecuriteServiceHero = {
    id: string;
    label?: string;
    titleLead: string;
    titleHighlight: string;
    titleTrail?: string;
    description: string;
    image: string;
    imageAlt: string;
    underline: MarketingPageHeroUnderline;
    stats: readonly MarketingPageHeroStat[];
    imageClassName?: string;
};

export type SuperSecuriteServiceDefinition = {
    id: SuperSecuriteServiceId;
    path: string;
    icon: string;
    cover: string;
    title: string;
    navLabel: string;
    navTagline: string;
    cardDescription: string;
    focusKeyword: string;
    metaTitle: string;
    metaDescription: string;
    hero: SuperSecuriteServiceHero;
    intro: readonly string[];
    introLabel?: string;
    introTitle?: string;
    introIndicators?: readonly string[];
    benefits: readonly string[];
    sectionsLabel?: string;
    sectionsTitle?: string;
    sections: readonly SuperSecuriteServiceSection[];
    includes: readonly string[];
    includesTitle?: string;
    includesDescription?: string;
    highlightsTitle?: string;
    highlights?: readonly string[];
    gallery: readonly SuperSecuriteServiceGalleryImage[];
    galleryTitle: string;
    galleryDescription: string;
};

const serviceImages = superSecuriteStock.home.services;

const serviceMeta: Record<
    SuperSecuriteServiceId,
    Omit<
        SuperSecuriteServiceDefinition,
        'id' | 'path' | 'icon' | 'title' | 'navLabel' | 'navTagline' | 'cardDescription'
    >
> = {
    entreprise: {
        focusKeyword: 'sécurité entreprise Guinée',
        metaTitle: 'Sécurité des entreprises | Super Sécurité — Guinée',
        metaDescription:
            'Gardiennage et surveillance pour entreprises en Guinée : bureaux, commerces, entrepôts, hôtels et sites industriels. Protection des collaborateurs et continuité des activités.',
        cover: `/${serviceImages.entreprise}`,
        hero: {
            id: 'entreprise',
            titleLead: 'Sécurité des',
            titleHighlight: 'entreprises',
            description:
                'Protégez vos collaborateurs, vos biens et la continuité de vos activités',
            image: `/${serviceImages.entreprise}`,
            imageAlt: 'Sécurité des entreprises — Super Sécurité Guinée',
            underline: 'grow',
            stats: [
                { label: 'Surveillance', value: '24h/24 • 7j/7' },
                { label: 'Couverture', value: 'Conakry & Toute la Guinée' },
                { label: 'Professionnalisme', value: 'Agents qualifiés et encadrés' },
            ],
        },
        intro: [
            "Dans un environnement où les risques de vol, d'intrusion, de vandalisme et d'accès non autorisés sont de plus en plus présents, la sécurité de votre entreprise ne peut être laissée au hasard.",
            'Super Sécurité accompagne les entreprises en Guinée avec des solutions de gardiennage et de surveillance adaptées à leurs besoins spécifiques. Nos équipes interviennent auprès des bureaux, commerces, entrepôts, hôtels, restaurants, sites industriels et autres infrastructures professionnelles pour assurer une protection efficace et continue de vos installations.',
            "Grâce à une présence dissuasive, des procédures rigoureuses et un suivi permanent, nous sécurisons vos activités tout en préservant votre image et votre tranquillité d'esprit.",
        ],
        introIndicators: [
            'Banques & institutions financières',
            'Hôtels & restaurants',
            'Commerces & supermarchés',
            'Entrepôts & bases logistiques',
            'Sites industriels',
            'Bureaux & sièges sociaux',
        ],
        benefits: [],
        sectionsTitle: 'Nos services de sécurité pour les entreprises',
        sections: [
            {
                title: 'Contrôle des accès',
                description:
                    'Gestion et filtrage des entrées et sorties, vérification des identités et orientation des visiteurs pour garantir un accès sécurisé à vos installations.',
            },
            {
                title: 'Surveillance des locaux',
                description:
                    "Protection permanente des bureaux, commerces, entrepôts et zones sensibles contre les risques d'intrusion, de vol ou de dégradation.",
            },
            {
                title: 'Rondes de sécurité',
                description:
                    "Patrouilles régulières de jour comme de nuit pour détecter toute anomalie et prévenir les incidents avant qu'ils ne surviennent.",
            },
            {
                title: 'Gestion des incidents',
                description:
                    "Intervention rapide et application des procédures adaptées en cas d'intrusion, d'incident ou de situation d'urgence.",
            },
            {
                title: 'Contrôle des véhicules',
                description:
                    'Vérification et suivi des véhicules entrant et sortant du site pour renforcer la sécurité de vos accès.',
            },
            {
                title: 'Protocoles & reporting',
                description:
                    'Consignes claires, rondes horodatées, registres de passage et rapports réguliers adaptés à vos exigences opérationnelles et contractuelles.',
            },
        ],
        includes: [],
        galleryTitle: 'Nos interventions entreprise',
        galleryDescription:
            'Aperçu en images de nos prestations de sécurisation, patrouilles et contrôle d\'accès dans les locaux professionnels.',
        gallery: [
            {
                src: '/images/super-securite/agents-super-securite-ronde-site-exterieur.jpeg',
                alt: 'Agents de sécurité effectuant une ronde extérieure',
                caption: 'Patrouilles régulières pour prévenir toute intrusion ou incident',
            },
            {
                src: '/images/super-securite/poste-de-garde-entree.jpeg',
                alt: 'Poste de garde et contrôle d\'accès à l\'entrée d\'un site',
                caption: 'Filtrage rigoureux à l\'entrée des locaux professionnels',
            },
            {
                src: '/images/super-securite/agent-securite-radio-portrait.jpeg',
                alt: 'Gros plan d\'un agent utilisant un talkie-talkie',
                caption: 'Communication constante avec notre centre de supervision',
            },
            {
                src: '/images/super-securite/agents-securite-echange-perimetre-cloture.jpeg',
                alt: 'Deux agents échangeant devant une clôture sécurisée',
                caption: 'Coordination et consignes claires lors des rondes de périmètre',
            },
            {
                src: '/images/super-securite/agent-uniforme-bleu-profil.jpeg',
                alt: 'Portrait d\'un agent de sécurité en uniforme bleu marine',
                caption: 'Agent de sécurité qualifié et équipé pour la surveillance d\'entreprise',
            },
            {
                src: '/images/super-securite/base-vie-logements.jpeg',
                alt: 'Bâtiments de base-vie et logements sur site d\'entreprise',
                caption: 'Sécurisation des infrastructures d\'hébergement et bases logistiques',
            },
            {
                src: '/images/super-securite/site-minier-stock-ferraille.jpeg',
                alt: 'Zone de stockage technique et ferraille sur site industriel',
                caption: 'Surveillance des zones de stockage et prévention des vols de métaux',
            },
            {
                src: '/images/super-securite/agents-intervention-patrouille-pickup.jpeg',
                alt: 'Véhicule pickup de patrouille et d\'intervention rapide',
                caption: 'Équipes d\'intervention mobile prêtes à être déployées sur vos sites',
            },
            {
                src: '/images/super-securite/agents-securite-site-bankitruck-large.jpeg',
                alt: 'Agents de sécurité postés sur le site industriel Bankitruck',
                caption: 'Surveillance et contrôle d\'accès sur le site logistique de notre partenaire Bankitruck',
            },
            {
                src: '/images/super-securite/agents-securite-site-bankitruck-medium.jpeg',
                alt: 'Équipe d\'agents devant les bureaux de Bankitruck',
                caption: 'Gardiennage professionnel et accueil sécurisé des visiteurs et transporteurs',
            },
            {
                src: '/images/super-securite/agents-securite-site-bankitruck-portrait.jpeg',
                alt: 'Agent de sécurité en position de surveillance chez Bankitruck',
                caption: 'Vigilance continue de nos agents pour sécuriser les flux de transport',
            },
        ],
    },
    residence: {
        focusKeyword: 'gardiennage résidence Guinée',
        metaTitle: 'Sécurité des résidences | Super Sécurité — Guinée',
        metaDescription:
            'Gardiennage et surveillance résidentielle en Guinée : villas, immeubles, résidences privées et cités. Protection de votre famille et de votre cadre de vie.',
        cover: `/${serviceImages.residence}`,
        hero: {
            id: 'residence',
            titleLead: 'Sécurité des',
            titleHighlight: 'résidences',
            description:
                'Protégez votre famille et votre cadre de vie en toute sérénité',
            image: `/${serviceImages.residence}`,
            imageAlt: 'Sécurité des résidences — Super Sécurité Guinée',
            underline: 'slide',
            imageClassName: 'object-top',
            stats: [
                { label: 'Résidences', value: 'Villas & immeubles' },
                { label: 'Surveillance', value: 'Jour et nuit' },
                { label: 'Disponibilité', value: '24h/24 • 7j/7' },
            ],
        },
        intro: [
            "La sécurité de votre domicile ne s'improvise pas. Que vous soyez propriétaire d'une villa, gestionnaire d'immeuble ou responsable d'une résidence privée, garantir un environnement sûr pour les occupants et les biens est une responsabilité que nous prenons au sérieux.",
            'Super Sécurité vous propose des solutions de gardiennage et de surveillance résidentielle assurées par des agents qualifiés, formés pour allier présence rassurante, discrétion et efficacité opérationnelle.',
        ],
        introIndicators: [
            'Villas privées',
            'Immeubles résidentiels',
            'Cités privées',
            "Résidences d'expatriés",
            'Résidences de cadres',
            'Résidences diplomatiques',
        ],
        benefits: [],
        sectionsTitle: 'Nos solutions de sécurité résidentielle',
        sections: [
            {
                title: 'Gardiennage 24h/24',
                description:
                    "Présence continue d'agents de sécurité pour assurer la protection permanente de votre résidence, de jour comme de nuit, sans interruption.",
            },
            {
                title: 'Contrôle des visiteurs',
                description:
                    'Gestion rigoureuse des entrées et sorties, enregistrement des visiteurs et vérification systématique des accès pour aucune intrusion non autorisée.',
            },
            {
                title: 'Surveillance des accès',
                description:
                    'Protection des points sensibles — portails, parkings, zones de passage — pour neutraliser tout risque d\'intrusion dès la périphérie.',
            },
            {
                title: 'Rondes de sécurité',
                description:
                    "Patrouilles régulières autour et à l'intérieur du périmètre pour détecter toute activité suspecte avant qu'elle ne devienne un incident.",
            },
            {
                title: 'Gestion des incidents',
                description:
                    "Réaction immédiate et intervention structurée en cas de situation anormale, d'intrusion ou de comportement menaçant.",
            },
            {
                title: 'Surveillance nocturne renforcée',
                description:
                    'Vigilance accrue en soirée et de nuit sur les accès, parkings et parties communes, lorsque les résidences sont les plus exposées.',
            },
        ],
        includes: [],
        galleryTitle: 'Sécurité résidentielle',
        galleryDescription:
            'Découvrez nos interventions en milieu résidentiel pour assurer la tranquillité et la sécurité de vos habitations.',
        gallery: [
            {
                src: '/images/super-securite/agents-securite-equipe.jpeg',
                alt: 'Équipe d\'agents de sécurité Super Sécurité',
                caption: 'Présence dissuasive et patrouilles de jour comme de nuit',
            },
            {
                src: '/images/super-securite/agent-lunettes-portrait-profil.jpeg',
                alt: 'Portrait d\'un agent de sécurité en lunettes de protection',
                caption: 'Agent qualifié assurant le contrôle des accès résidentiels',
            },
            {
                src: '/images/super-securite/IMG_9598.heic',
                alt: 'Agent de garde sur site résidentiel',
                caption: 'Protection et vigilance continues pour votre tranquillité',
            },
            {
                src: '/images/super-securite/IMG_9665.heic',
                alt: 'Patrouille de surveillance autour de la résidence',
                caption: 'Rondes régulières de contrôle de la clôture et des accès',
            },
            {
                src: '/images/super-securite/formation-securite-extincteur.jpeg',
                alt: 'Démonstration d\'utilisation de l\'extincteur',
                caption: 'Formation continue de nos agents aux consignes de sécurité incendie',
            },
        ],
    },
    chantiers: {
        focusKeyword: 'sécurité chantier Guinée',
        metaTitle: 'Sécurité des chantiers | Super Sécurité — Guinée',
        metaDescription:
            'Gardiennage et surveillance de chantiers BTP en Guinée : contrôle des accès, rondes, protection des matériaux et gestion des incidents.',
        cover: `/${serviceImages.chantiers}`,
        hero: {
            id: 'chantiers',
            titleLead: 'Sécurité des',
            titleHighlight: 'chantiers',
            description:
                'Protégez vos travaux, vos équipes et vos équipements',
            image: `/${serviceImages.chantiers}`,
            imageAlt: 'Sécurité des chantiers — Super Sécurité Guinée',
            underline: 'draw',
            stats: [
                { label: 'Secteurs', value: 'BTP & infrastructures' },
                { label: 'Surveillance', value: "Rondes et contrôle d'accès" },
                { label: 'Disponibilité', value: '24h/24 • 7j/7' },
            ],
        },
        intro: [
            'Les chantiers de construction sont des zones particulièrement vulnérables : vols de matériaux, intrusions, vandalisme, mouvements non contrôlés de personnes et de véhicules — les risques sont constants et peuvent impacter directement vos délais et vos coûts.',
            "Super Sécurité accompagne les entreprises du BTP en Guinée avec des solutions de gardiennage et de surveillance adaptées aux chantiers de toutes tailles, qu'il s'agisse de travaux publics, de construction immobilière ou d'infrastructures industrielles.",
            'Notre objectif est clair : assurer la protection continue de vos sites pour que vos équipes travaillent en sécurité et que vos travaux progressent sans interruption.',
        ],
        introIndicators: [
            'Construction immobilière',
            'Routes & ponts',
            'Chantiers industriels',
            'Chantiers de rénovation',
            'Complexes résidentiels',
            'Aménagement urbain',
        ],
        benefits: [],
        sectionsTitle: 'Nos services de sécurité pour chantiers',
        sections: [
            {
                title: 'Contrôle des accès',
                description:
                    'Gestion rigoureuse des entrées et sorties du personnel, des visiteurs et des fournisseurs pour maintenir un site maîtrisé à tout moment.',
            },
            {
                title: 'Surveillance du chantier',
                description:
                    'Protection permanente des zones de travail, des matériaux stockés et des équipements contre le vol, les dégradations et les accès non autorisés.',
            },
            {
                title: 'Rondes de sécurité',
                description:
                    "Patrouilles régulières de jour comme de nuit pour détecter toute anomalie et intervenir avant qu'un incident ne se produise.",
            },
            {
                title: 'Contrôle des véhicules',
                description:
                    'Vérification systématique des camions, engins et véhicules entrant et sortant du site pour prévenir tout mouvement suspect.',
            },
            {
                title: 'Gestion des incidents',
                description:
                    "Intervention rapide, structurée et documentée en cas d'intrusion, d'incident ou de situation anormale sur le chantier.",
            },
            {
                title: 'Coordination chantier',
                description:
                    "Liaison avec le chef de chantier et remontée rapide des anomalies pour ne pas ralentir l'avancement des travaux.",
            },
        ],
        includes: [],
        galleryTitle: 'Chantiers sécurisés',
        galleryDescription:
            'Découvrez en images nos interventions réelles de gardiennage et sécurisation sur différents chantiers BTP.',
        gallery: [
            {
                src: '/images/super-securite/chantier-structure-beton-echafaudage-equipe.jpeg',
                alt: 'Chantier avec structure en béton et échafaudages',
                caption: 'Surveillance de zones de travaux en hauteur et sécurisation des accès',
            },
            {
                src: '/images/super-securite/equipe-technique-assemblage-structure-metallique.jpeg',
                alt: 'Équipe technique assemblant une structure métallique',
                caption: 'Assemblage de structures métalliques complexes sous haute surveillance',
            },
            {
                src: '/images/super-securite/chantier-grue-equipe-maintenance-site.jpeg',
                alt: 'Équipe de maintenance sur chantier avec grue',
                caption: 'Contrôle de sécurité lors des opérations de levage et de maintenance',
            },
            {
                src: '/images/super-securite/base-vie-chantier-grue-stock-materiaux.jpeg',
                alt: 'Base-vie de chantier avec grue et stock de matériaux',
                caption: 'Surveillance périmétrique du parc de stockage de matériaux précieux',
            },
            {
                src: '/images/super-securite/chantier-fondations-poteaux-camion-grue.jpeg',
                alt: 'Camion-grue sur chantier de fondations et poteaux',
                caption: 'Sécurisation des engins lourds et des flux de circulation sur site',
            },
            {
                src: '/images/super-securite/chantier-assemblage-metallique-grue-mobile.jpeg',
                alt: 'Assemblage métallique avec grue mobile sur chantier',
                caption: 'Protection et encadrement des opérations de gros œuvre',
            },
        ],
    },
    'zones-minieres': {
        focusKeyword: 'sécurité sites miniers Guinée',
        metaTitle: 'Sécurité des sites miniers | Super Sécurité — Guinée',
        metaDescription:
            'Sécurité des sites miniers en Guinée : contrôle des accès, surveillance des bases-vie, rondes et gestion des incidents pour mines de bauxite, or et carrières.',
        cover: `/${serviceImages['zones-minieres']}`,
        hero: {
            id: 'zones-minieres',
            titleLead: 'Sécurité des',
            titleHighlight: 'sites miniers',
            description:
                "Une protection adaptée aux exigences de l'industrie minière",
            image: `/${serviceImages['zones-minieres']}`,
            imageAlt: 'Sécurité des sites miniers — Super Sécurité Guinée',
            underline: 'scan',
            stats: [
                { label: 'Secteurs', value: 'Mines & sites sensibles' },
                { label: 'Protocoles', value: 'Stricts et adaptés au terrain' },
                {
                    label: 'Expertise',
                    value: 'Sécurité en environnements à haut risque',
                },
            ],
        },
        intro: [
            "La Guinée occupe une position stratégique dans l'industrie minière mondiale, portée par ses importantes ressources en bauxite, or et autres minerais. Cette richesse s'accompagne d'enjeux de sécurité majeurs : intrusions, vols, sabotages, perturbations des opérations — les risques sont réels et les conséquences potentiellement lourdes.",
            "Super Sécurité accompagne les acteurs du secteur minier en Guinée avec des dispositifs de sécurité robustes, pensés pour les environnements exigeants et les contraintes opérationnelles propres aux sites d'extraction et d'exploitation.",
        ],
        introIndicators: [
            'Mines',
            'Carrières',
            'Bases-vie',
            'Infrastructures portuaires',
            "Sites d'exploitation",
            "Zones d'exploration",
        ],
        benefits: [],
        sectionsTitle: 'Nos services de sécurité pour sites miniers',
        sections: [
            {
                title: 'Contrôle des accès',
                description:
                    'Gestion rigoureuse des entrées et sorties du personnel, des visiteurs et des sous-traitants pour sécuriser l\'ensemble du périmètre du site.',
            },
            {
                title: 'Surveillance des bases-vie',
                description:
                    "Protection des zones d'hébergement du personnel pour garantir un cadre de vie sûr, stable et maîtrisé en dehors des heures de travail.",
            },
            {
                title: 'Contrôle des véhicules',
                description:
                    'Inspection systématique des véhicules entrant et sortant du site afin de prévenir toute tentative de vol ou d\'introduction d\'éléments non autorisés.',
            },
            {
                title: 'Sécurisation des infrastructures',
                description:
                    'Protection des bureaux, ateliers, entrepôts et zones sensibles contre toute tentative d\'intrusion, de dégradation ou de sabotage.',
            },
            {
                title: 'Rondes de sécurité',
                description:
                    'Patrouilles continues sur l\'ensemble du site pour maintenir une surveillance active et dissuader tout comportement malveillant.',
            },
            {
                title: 'Gestion des incidents',
                description:
                    'Application immédiate des procédures de sécurité et remontée structurée des alertes pour une réponse rapide et traçable.',
            },
        ],
        includes: [],
        highlightsTitle:
            'Pourquoi les acteurs miniers choisissent Super Sécurité ?',
        highlights: [
            'Agents expérimentés, formés aux environnements sensibles et isolés',
            'Supervision terrain dédiée, continue et documentée',
            'Forte capacité de déploiement sur les sites éloignés',
            'Respect strict des procédures HSE et des normes de sûreté internationales',
            "Rapports d'incidents clairs, détaillés et transmis dans les délais",
            'Présence opérationnelle établie dans les principales zones minières de Guinée',
        ],
        galleryTitle: 'Zones minières & sites sensibles',
        galleryDescription:
            'Aperçu en images de nos prestations de sécurisation et de surveillance sur des installations minières complexes.',
        gallery: [
            {
                src: '/images/super-securite/installation-industrielle-convoyeurs-miniers.jpeg',
                alt: 'Installation industrielle avec convoyeurs miniers',
                caption: 'Sécurisation des convoyeurs et des installations de traitement du minerai',
            },
            {
                src: '/images/super-securite/site-industriel-groupe-electrogene-zone-technique.jpeg',
                alt: 'Groupe électrogène en zone technique de site industriel',
                caption: 'Surveillance rigoureuse des infrastructures critiques et zones techniques',
            },
            {
                src: '/images/super-securite/equipe-technique-assemblage-structure-metallique.jpeg',
                alt: 'Équipe technique d\'assemblage de structure métallique',
                caption: 'Encadrement sécuritaire lors des opérations d\'assemblage et de montage',
            },
            {
                src: '/images/super-securite/securite-installation-convoyeur-minier.jpeg',
                alt: 'Agent de sécurité sur site d\'exploitation',
                caption: 'Présence continue de nos agents formés aux environnements miniers',
            },
            {
                src: '/images/super-securite/securite-installation-convoyeur-minier.jpeg',
                alt: 'Sécurisation des installations de convoyeurs sur site minier',
                caption: 'Vigilance accrue et contrôle de sécurité autour des infrastructures minières',
            },
        ],
    },
};

export const superSecuriteServiceDefinitions: readonly SuperSecuriteServiceDefinition[] =
    superSecuriteServices.map((service) => {
        const meta = serviceMeta[service.id as SuperSecuriteServiceId];

        return {
            id: service.id as SuperSecuriteServiceId,
            path: service.path,
            icon: '',
            title: service.title,
            navLabel: service.title.replace('Sécurité ', ''),
            navTagline: `Sécurité privée à ${superSecuriteZoneLabel}`,
            cardDescription: service.description,
            ...meta,
        };
    });

export const superSecuriteServiceById: Record<
    SuperSecuriteServiceId,
    SuperSecuriteServiceDefinition
> = Object.fromEntries(
    superSecuriteServiceDefinitions.map((service) => [service.id, service]),
) as Record<SuperSecuriteServiceId, SuperSecuriteServiceDefinition>;

export const superSecuriteServiceIds: readonly SuperSecuriteServiceId[] =
    superSecuriteServiceDefinitions.map((service) => service.id);
