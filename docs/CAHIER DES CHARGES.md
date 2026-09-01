# CAHIER DES CHARGES

## Module de communication par e-mail et WhatsApp

**Projet :** Super Sécurité — site web et espace d’administration
**Document :** Version client — septembre 2026
**Objet :** Cadrage des prestations, livrables et conditions de facturation

---

## 1. Objet du document

Le présent cahier des charges définit le périmètre fonctionnel, les livrables attendus et les conditions financières du **module de communication marketing** intégré à la plateforme Super Sécurité.

Il sert de base :

* à la validation du besoin ;
* au suivi du développement ;
* à la validation du produit final ;
* à la mise en production ;
* à la facturation de la prestation.

---

## 2. Contexte

Super Sécurité dispose d’un site web public présentant notamment ses activités, actualités, conseils, galerie, contacts et candidatures d’agents, ainsi que d’un **espace d’administration sécurisé** permettant de gérer le contenu, les utilisateurs et l’activité du site.

Dans le cadre de l’évolution de la plateforme, il est prévu d’intégrer un **module de communication** permettant à l’équipe Super Sécurité d’envoyer des messages **par e-mail et par WhatsApp** à partir des contacts enregistrés.

Le module permettra notamment de gérer les contacts, créer des listes de diffusion, préparer des campagnes, personnaliser les messages et suivre les résultats des envois.

Le module sera intégré à l’administration existante, avec une interface cohérente avec la charte graphique et les exigences de sécurité de la plateforme.

---

## 3. Objectifs

Le module devra permettre :

* de **centraliser les contacts** clients et prospects ;
* d’organiser des **listes de diffusion** ;
* de créer des **modèles de messages** réutilisables ;
* d’envoyer des communications **individuelles ou groupées** ;
* de personnaliser les messages avec des informations dynamiques ;
* d'effectuer des campagnes par e-mail ;
* d'effectuer des campagnes par WhatsApp ;
* de consulter l’**historique des communications** ;
* de suivre le **statut de chaque message** ;
* de disposer d’un **tableau de bord récapitulatif** ;
* de préparer une base évolutive permettant l’ajout ultérieur de fonctionnalités marketing avancées.

---

# 4. Prestations à réaliser — vue d’ensemble

Le développement du module est organisé en **trois lots fonctionnels** :

| Lot       | Intitulé           | Contenu principal                                           |
| --------- | ------------------ | ----------------------------------------------------------- |
| **Lot 1** | Contacts et listes | Répertoire clients, listes de diffusion, import de fichiers |
| **Lot 2** | Campagnes e-mail   | Modèles, envois, historique, suivi des statuts              |
| **Lot 3** | Campagnes WhatsApp | Intégration WhatsApp Business (Meta), modèles et suivi      |

Les lots constituent des étapes de développement internes. Le règlement de la prestation intervient **uniquement après livraison et validation du module complet**.

---

# 5. Fonctionnalités détaillées

## 5.1 Gestion des contacts et listes — Lot 1

### Contacts

Le système devra permettre :

* la création de fiches contact ;
* la modification des fiches contact ;
* la suppression des contacts ;
* la recherche de contacts ;
* le filtrage des contacts ;
* la détection des doublons.

Les informations pourront notamment comprendre :

* Nom ;
* Prénom ;
* Adresse e-mail ;
* Numéro de téléphone / WhatsApp ;
* Autres informations disponibles dans la plateforme.

### Listes de diffusion

Le système devra permettre :

* la création de listes de diffusion ;
* la modification des listes ;
* la suppression des listes ;
* l’ajout de contacts à une liste ;
* le retrait de contacts d’une liste ;
* l'utilisation d'une liste comme cible d'une campagne.

### Import de contacts

Le système devra permettre l’import de contacts depuis un fichier **CSV**.

Après chaque import, un rapport permettra d'identifier :

* les contacts ajoutés ;
* les contacts ignorés ;
* les contacts en erreur ;
* les éventuels doublons détectés.

---

# 6. Gestion des modèles de messages

L'administrateur ou l'utilisateur autorisé pourra créer et gérer des **modèles de messages réutilisables**.

Chaque modèle pourra comprendre :

* un titre interne ;
* un objet pour les e-mails ;
* le contenu du message ;
* le canal concerné : e-mail ou WhatsApp ;
* des variables dynamiques.

### Exemple

> Bonjour {{prenom}} {{nom}},
> Votre demande {{reference}} est actuellement en cours de traitement.

Lors de l’envoi, les variables seront automatiquement remplacées par les informations correspondantes du contact.

Pour WhatsApp, les messages professionnels s'appuieront sur les **modèles approuvés par Meta**, conformément aux règles applicables à WhatsApp Business.

---

# 7. Envoi d’e-mails — Lot 2

Le module devra permettre :

* la rédaction d’un message ;
* la sélection d’un modèle ;
* la sélection d’un ou plusieurs destinataires ;
* la sélection d’une liste de diffusion ;
* l’envoi individuel ;
* l’envoi groupé ;
* la personnalisation de l’objet et du contenu ;
* l'utilisation de variables dynamiques ;
* l’enregistrement automatique de chaque communication dans l’historique ;
* l'identification des envois réussis ;
* l'identification des envois échoués ;
* l'affichage du motif de l'échec lorsqu'il est fourni par le service d'envoi.

### Suivi des e-mails

Lorsque le fournisseur d’e-mail et les conditions techniques le permettent, le système pourra également permettre le suivi :

* de la réception ;
* de l'ouverture du message.

Les indicateurs de réception et d'ouverture sont dépendants des possibilités techniques du fournisseur d'e-mails et ne peuvent donc pas être garantis dans tous les cas.

### Envois groupés

Les envois groupés seront traités de manière **progressive et contrôlée** afin de limiter les risques de blocage et de respecter les limites imposées par le fournisseur d’e-mails.

---

# 8. Envoi de messages WhatsApp — Lot 3

Le système devra permettre l'envoi de messages WhatsApp via l'**API officielle WhatsApp Business de Meta**.

Fonctionnalités prévues :

* sélection des destinataires ;
* sélection d'une liste de diffusion ;
* utilisation de modèles WhatsApp approuvés ;
* personnalisation par variables dynamiques ;
* envoi individuel ;
* envoi groupé ;
* enregistrement des communications dans l'historique ;
* suivi du statut des messages.

### Suivi des messages WhatsApp

Lorsque les informations sont fournies par l’API WhatsApp, le système pourra afficher :

* message en attente ;
* message envoyé ;
* message livré ;
* message lu ;
* message en échec.

L'accusé de lecture dépend notamment des paramètres de confidentialité du destinataire et n'est donc **pas garanti dans tous les cas**.

Les frais liés au compte WhatsApp Business et à l’utilisation de l’API Meta restent à la charge du client.

---

# 9. Historique des communications

Une interface dédiée permettra de consulter les communications effectuées.

Pour chaque communication, le système pourra afficher :

| Information    | Détail                                      |
| -------------- | ------------------------------------------- |
| Destinataire   | Contact concerné                            |
| Campagne       | Nom de la campagne                          |
| Canal          | E-mail ou WhatsApp                          |
| Date et heure  | Horodatage de l'envoi                       |
| Contenu        | Objet ou aperçu du message                  |
| Modèle utilisé | Le cas échéant                              |
| Statut         | En attente, envoyé, reçu, lu, échec, annulé |
| Erreur         | Message d’erreur lorsqu'il est disponible   |

L'historique pourra être filtré notamment par :

* campagne ;
* canal ;
* statut ;
* destinataire ;
* période.

---

# 10. Profils utilisateurs et accès

Le module devra respecter les droits d'accès définis dans l'administration de la plateforme.

| Profil             | Usage                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------- |
| **Administrateur** | Accès complet selon les droits accordés et configuration des services                  |
| **Commercial**     | Accès au module marketing : contacts, listes, campagnes, historique et tableau de bord |
| **Contributeur**   | Accès aux fonctionnalités marketing uniquement lorsque les droits lui sont accordés    |

Chaque utilisateur ne devra voir que les menus et actions correspondant à ses autorisations.

Les fonctions sensibles de configuration des services seront réservées aux utilisateurs disposant des droits appropriés.

---

# 11. Interface d’administration

Le module sera intégré à l'**espace d'administration existant** de Super Sécurité.

Les principales sections seront :

* Tableau de bord ;
* Contacts ;
* Listes de diffusion ;
* Modèles de messages ;
* Nouvelles campagnes ;
* Campagnes en cours ;
* Historique des communications ;
* Paramètres des services.

L'interface devra être utilisable sur :

* ordinateur ;
* tablette ;
* smartphone.

L'interface devra respecter la charte graphique et les principes d'ergonomie du backoffice existant.

---

# 12. Tableau de bord

Un tableau de bord synthétique permettra notamment de consulter :

* le nombre total de messages envoyés ;
* la répartition entre e-mails et WhatsApp ;
* le nombre de messages réussis ;
* le nombre de messages échoués ;
* les campagnes récentes ;
* les indicateurs de réception ;
* les indicateurs d'ouverture des e-mails lorsque disponibles ;
* les indicateurs de lecture WhatsApp lorsque disponibles.

---

# 13. Configuration des services

La mise en service du module nécessitera la configuration des services externes nécessaires.

## E-mail

Selon la solution retenue :

* serveur SMTP ou service d'envoi d'e-mails ;
* adresse d'expédition ;
* nom de l'expéditeur ;
* identifiants ou clés d'accès ;
* paramètres nécessaires à l'envoi.

## WhatsApp

La configuration nécessitera notamment :

* un compte Meta Business ;
* un numéro WhatsApp professionnel ;
* l'accès à l'API WhatsApp Cloud ;
* les paramètres d'authentification nécessaires ;
* la création et la validation des modèles de messages auprès de Meta.

Les informations sensibles seront configurées de manière sécurisée.

Le prestataire pourra accompagner le client dans la configuration des services, mais les comptes, abonnements, consommations et frais associés restent sous la responsabilité du client.

---

# 14. Sécurité

Le module devra respecter les règles de sécurité applicables à la plateforme existante.

Notamment :

* accès réservé aux utilisateurs autorisés ;
* protection des mots de passe et clés API ;
* validation des données saisies ;
* protection des informations sensibles ;
* journalisation des opérations importantes ;
* contrôle des droits d'accès ;
* prise en compte des consentements nécessaires avant les envois massifs.

---

# 15. Envois groupés

Pour les communications destinées à plusieurs contacts, le système devra :

* traiter les envois de manière contrôlée ;
* traiter progressivement les volumes importants lorsque nécessaire ;
* enregistrer individuellement le résultat de chaque envoi ;
* limiter les risques de blocage par les fournisseurs ;
* respecter les limites techniques imposées par les services utilisés.

Le fonctionnement des envois reste soumis aux limites et politiques des fournisseurs externes.

---

# 16. Compatibilité et design

Le module devra :

* être responsive ;
* fonctionner sur ordinateur, tablette et smartphone ;
* s'intégrer visuellement à l'administration existante ;
* respecter la navigation et les composants graphiques existants ;
* conserver une expérience utilisateur cohérente avec la plateforme Super Sécurité.

---

# 17. Livrables

À l'issue du projet, les éléments suivants seront livrés :

* Module de communication intégré au site ;
* Gestion des contacts ;
* Gestion des listes de diffusion ;
* Import de contacts par fichier CSV ;
* Gestion des modèles de messages ;
* Gestion des campagnes ;
* Envoi d’e-mails individuels et groupés ;
* Intégration WhatsApp Business via l'API officielle Meta ;
* Historique des communications ;
* Suivi des statuts ;
* Tableau de bord ;
* Paramétrage des services e-mail et WhatsApp ;
* Guide de configuration et d'utilisation ;
* Mise en production accompagnée.

---

# 18. Prestations et frais exclus du développement

Les éléments suivants ne sont **pas inclus** dans le montant du développement et restent à la charge du client :

* abonnement à un service d'envoi d'e-mails ;
* frais d'envoi des e-mails ;
* compte Meta Business ;
* compte WhatsApp Business ;
* frais liés à l'utilisation de l'API WhatsApp Meta ;
* crédits ou forfaits de messagerie ;
* hébergement du site ;
* nom de domaine ;
* éventuels services tiers nécessaires au fonctionnement du module ;
* éventuels frais liés aux services externes.

Le prestataire accompagne le client dans la configuration des services nécessaires, mais leur souscription, leur facturation et leur renouvellement restent sous la responsabilité du client.

---

# 19. Planning de livraison

Le développement sera réalisé progressivement selon les lots fonctionnels définis dans le présent cahier des charges :

| Lot       | Livrable principal             |
| --------- | ------------------------------ |
| **Lot 1** | Contacts, listes et import CSV |
| **Lot 2** | Campagnes e-mail et suivi      |
| **Lot 3** | WhatsApp Meta et suivi         |

Les lots constituent des étapes internes de développement et peuvent être réalisés successivement afin de faciliter les tests et la validation technique.

Une phase de tests et de recette globale sera réalisée avant la livraison finale.

Le module sera mis en production après validation du bon fonctionnement des fonctionnalités prévues.

---

# 20. Recette et validation

Avant la mise en production, des tests seront réalisés afin de vérifier notamment :

* la création et la gestion des contacts ;
* la création et la gestion des listes ;
* l'import de fichiers CSV ;
* la détection des doublons ;
* la création des modèles ;
* l'envoi d'e-mails individuels ;
* l'envoi d'e-mails groupés ;
* l'envoi de messages WhatsApp ;
* le remplacement des variables dynamiques ;
* l'enregistrement de l'historique ;
* le suivi des statuts ;
* la gestion des erreurs ;
* les droits d'accès ;
* l'affichage sur ordinateur et mobile.

La **validation finale** sera prononcée après présentation du module au client et vérification des fonctionnalités prévues dans le présent cahier des charges.

---

# 21. Évolutions futures — hors présent contrat

Les fonctionnalités suivantes pourront faire l'objet d'un **développement complémentaire** et d'une estimation séparée :

* planification automatique des campagnes ;
* envois déclenchés automatiquement par des événements du site ;
* segmentation avancée des contacts ;
* statistiques détaillées ;
* suivi des clics ;
* suivi des taux de conversion ;
* import automatique depuis les formulaires du site ;
* automatisation marketing ;
* éditeur avancé de messages ;
* gestion avancée des scénarios de communication ;
* notifications automatiques selon différents événements.

Toute fonctionnalité non explicitement prévue dans le présent cahier des charges sera considérée comme une évolution et pourra faire l'objet d'une proposition financière complémentaire.

---

# 22. Proposition financière

## Développement du module de communication

Le développement et l'intégration des fonctionnalités décrites dans le présent cahier des charges sont proposés au forfait suivant :

### **Montant total : 1 500 000 GNF**

Ce montant comprend :

* analyse et conception ;
* développement des fonctionnalités prévues ;
* gestion des contacts et listes ;
* import CSV ;
* gestion des modèles ;
* développement des campagnes e-mail ;
* intégration WhatsApp Business via l'API officielle Meta ;
* historique et suivi des communications ;
* tableau de bord ;
* intégration à l'administration existante ;
* tests et corrections liées au développement ;
* documentation utilisateur ;
* accompagnement à la mise en production.

### Modalités de paiement

Le montant forfaitaire de **1 500 000 GNF** sera réglé **à la livraison du module complet**, après présentation, tests et validation du produit par le client.

La validation sera effectuée sur la base des fonctionnalités définies dans le présent cahier des charges.

Toute demande de fonctionnalité supplémentaire ou modification importante ne figurant pas dans le présent périmètre pourra faire l'objet d'une estimation complémentaire.

---

# 23. Maintenance et accompagnement

La maintenance après mise en production n'est pas incluse dans le montant forfaitaire de **1 500 000 GNF**.

Les anomalies directement liées au développement livré et constatées lors de la phase initiale de validation seront corrigées dans le cadre de la prestation.

Une formule de maintenance et d'accompagnement pourra être proposée séparément, comprenant notamment :

* correction des anomalies ;
* assistance technique ;
* accompagnement des utilisateurs ;
* mise à jour de la configuration ;
* adaptation aux évolutions des services externes ;
* maintenance du module ;
* accompagnement de l'équipe commerciale et des administrateurs.

Les changements majeurs imposés par des services tiers, notamment Meta, les fournisseurs d'e-mails ou les API utilisées, et nécessitant un développement complémentaire pourront faire l'objet d'une prestation distincte.

---

# 24. Conclusion

Le présent projet permettra à Super Sécurité de disposer d'un **outil centralisé de communication par e-mail et WhatsApp**, directement intégré à son site et à son espace d'administration.

La solution permettra à l'équipe de gérer ses contacts, organiser ses listes, préparer des campagnes, envoyer des communications et suivre les résultats des envois depuis une interface unique.

Le module sera conçu de manière **modulaire et évolutive**, afin de permettre l'ajout ultérieur de fonctionnalités marketing plus avancées en fonction des besoins de Super Sécurité.

L'objectif est de fournir un outil **simple, fiable, sécurisé et évolutif**, adapté aux besoins actuels de communication de l'entreprise.
