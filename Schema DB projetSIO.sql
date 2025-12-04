CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `mfa_secret` varchar(255) COMMENT 'Clé secrète pour la double authentification (TOTP)',
  `is_active` boolean DEFAULT true,
  `last_login` datetime,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `roles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nom` varchar(255) UNIQUE NOT NULL,
  `description` varchar(255),
  `visibilite_scope` varchar(255) DEFAULT 'ASSIGNED' COMMENT 'Définit quels dossiers l''utilisateur peut voir',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `permissions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `code` varchar(255) UNIQUE NOT NULL,
  `description` varchar(255)
);

CREATE TABLE `role_permissions` (
  `role_id` int,
  `permission_id` int,
  PRIMARY KEY (`role_id`, `permission_id`)
);

CREATE TABLE `signalements` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `tracking_code` varchar(255) UNIQUE NOT NULL COMMENT 'Code unique haute entropie',
  `tracking_password_hash` varchar(255) NOT NULL COMMENT 'Mot de passe secondaire du dossier',
  `is_anonymous` boolean DEFAULT true,
  `deposant_email_encrypted` blob,
  `description_encrypted` blob NOT NULL,
  `lieu_encrypted` blob,
  `date_fait_encrypted` blob,
  `statut` ENUM ('nouveau', 'en-cours', 'cloture', 'classe-sans-suite') DEFAULT 'nouveau',
  `priorite` ENUM ('faible', 'modere', 'critique') DEFAULT 'faible',
  `mode` ENUM ('anonyme', 'confidentiel') DEFAULT 'anonyme',
  `categorie_detectee` varchar(255) COMMENT 'Proposée par l''IA (F.3.3)',
  `categorie_finale` varchar(255) COMMENT 'Validée/Corrigée par l''humain (F.2.3)',
  `assignee_id` int COMMENT 'RH ou Juriste responsable du dossier',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime,
  `archived` boolean DEFAULT false
);

CREATE TABLE `pieces_jointes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `signalement_id` int NOT NULL,
  `encrypted_path` varchar(255) NOT NULL COMMENT 'Chemin S3/Local vers le fichier chiffré',
  `original_filename_encrypted` blob COMMENT 'Nom du fichier chiffré',
  `mime_type` varchar(255),
  `file_size` int,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `messages` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `signalement_id` int NOT NULL,
  `emetteur_type` ENUM ('user', 'deposant') NOT NULL,
  `user_id` int COMMENT 'Null si c''est le déposant anonyme',
  `contenu_encrypted` blob NOT NULL COMMENT 'Chiffré AES-256',
  `is_read` boolean DEFAULT false,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `audit_logs` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `signalement_id` int,
  `user_id` int,
  `action` varchar(255) NOT NULL,
  `details_encrypted` blob COMMENT 'Détails contextuels chiffrés',
  `ip_address` varchar(255),
  `previous_hash` varchar(255) NOT NULL COMMENT 'Lien cryptographique vers le log précédent',
  `current_hash` varchar(255) NOT NULL COMMENT 'Signature de la ligne actuelle',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `ia_classifications` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `signalement_id` int NOT NULL,
  `categorie_proposee` varchar(255) NOT NULL,
  `probabilite` float COMMENT 'Score de confiance (0.0 à 1.0)',
  `model_version` varchar(255) COMMENT 'Version du modèle utilisé',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `role_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `role_permissions` ADD FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`);

ALTER TABLE `signalements` ADD FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`);

ALTER TABLE `pieces_jointes` ADD FOREIGN KEY (`signalement_id`) REFERENCES `signalements` (`id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`signalement_id`) REFERENCES `signalements` (`id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `audit_logs` ADD FOREIGN KEY (`signalement_id`) REFERENCES `signalements` (`id`);

ALTER TABLE `audit_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `ia_classifications` ADD FOREIGN KEY (`signalement_id`) REFERENCES `signalements` (`id`);
