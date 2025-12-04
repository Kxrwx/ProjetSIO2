# Projet Gestion des Signalements Internes (LegalTech)

## 🎓 Contexte du Projet

Projet de deuxième année – BTS SIO

---
## 🗄️ Bibliotheque de ressource 
Lien vers la db en ligne **Aiven** : https://console.aiven.io/account/a57aeda6410d/project/sioproject/services/mysql-19a1f367/overview

## 📝 Descriptif de la Solution (Architecture Modulaire)

Notre projet vise à concevoir une **solution numérique modulaire, sécurisée et conforme** pour la gestion des signalements de conflits internes en entreprise. Il s'inscrit dans une démarche de LegalTech, avec une exigence critique sur la confidentialité et la traçabilité.

La solution est structurée autour de **trois modules** communiquant via une API centralisée :

| Rôle | Module / Technologie | Fonction Principale |
| :--- | :--- | :--- |
| **RH / Juristes (Gestionnaires)** | **Module 1 : Application Client Lourd (Windev)** | Traitement sécurisé des cas, authentification forte, historique, et administration de l'IA. |
| **Salariés (Utilisateurs finaux)** | **Module 2 : Webapp de Dépôt et de Suivi (React)** | Dépôt de signalement (anonyme ou identifié) et suivi via un code unique. |
| **Cœur du Système (Sécurité)** | **Module 3 : API REST Sécurisée (Python/Flask)** | Chiffrement AES-256, stockage sécurisé, gestion des flux, et classification "Pseudo-IA". |

---
## 📚 Contenu du Projet (Basé sur le Cahier des Charges Final)

Le Cahier des Charges de ce projet suit la structure professionnelle imposée :

### 1. Présentation du Projet

* **Intitulé :** Solution Modulaire de Conformité et de Gestion des Signalements Internes
* **Client fictif :** HRComplianceTech Solutions
* **Prestataires :** Équipe BTS SIO
* **Nature du livrable :** Application complète (Web + Client Lourd), API, et Documentation de Conformité.

### 2. Contexte et Parties Prenantes

Le projet répond à l'obligation légale des entreprises de fournir un canal sécurisé de signalement (Loi Sapin 2) tout en garantissant la protection des données (RGPD).

* **Parties prenantes :** Client (HRComplianceTech), Salariés (Utilisateurs Finaux), Service RH, Juristes, Équipe projet.

### 3. Objectifs Critiques du Projet

1.  **Conformité Légal :** Répondre strictement aux exigences du **RGPD** et de la **Loi Sapin 2**.
2.  **Sécurité & Anonymat :** Garantir le chiffrement des données sensibles et l'anonymat du lanceur d'alerte.
3.  **Efficacité :** Fournir aux RH/Juristes un outil puissant de suivi et de traitement.

### 4. Besoins Fonctionnels

* **Module 1 (Windev - RH/Juristes) :** Authentification forte, Tableau de bord, Gestion des rôles, Traitement et affectation des cas, Messagerie confidentielle, Journalisation (Audit Log).
* **Module 2 (Webapp - Salariés) :** Formulaire de dépôt simple, Génération de code de suivi anonyme, Interface de suivi et de messagerie sécurisée.
* **Module 3 (API) :** Service de classification automatique ("IA"), Chiffrement fort des données stockées.

### 5. Besoins Non Fonctionnels

* **Sécurité (Critique) :** Chiffrement AES-256, Implémentation de Cloudflare pour la protection anti-bot/DDoS, Alignement sur la norme **ISO 27001**.
* **Confidentialité :** Anonymisation technique des données brutes, accès restreint par rôles.
* **Ergonomie :** Interface **Responsive** (Webapp Salariés), Ergonomie bureautique optimisée (Windev RH/Juristes).

### 6. Spécifications Techniques

* **Backend (API) :** **Python/Flask** (choix de l'ORM : SQLAlchemy ou SQLModel), utilisation de bibliothèques de chiffrement avancées.
* **Frontend (Salariés) :** React.
* **Client Lourd (RH/Juristes) :** **Windev**.
* **Base de Données :** **MySQL** (recommandé pour la robustesse et l'intégrité des données critiques).

### 7. Contraintes

* **Légales :** Respect strict du RGPD et de la Loi Sapin 2 (C.8.3.4).
* **Techniques :** Compatibilité exclusive de l'Application Windev avec **Windows 10 Pro+** (C.8.3.2).
* **Sécurité :** Obligation d'utiliser l'algorithme de chiffrement **AES-256** (C.8.3.1).

### 8. Livrables Attendus

* Cahier des charges final (PDF).
* Application complète fonctionnelle (Code source sur GitHub).
* Documentation technique (API, installation, sécurité).
* Manuel utilisateur (pour les Salariés et pour les Gestionnaires RH/Juristes).
* Dossier de conformité RGPD / Loi Sapin 2.
