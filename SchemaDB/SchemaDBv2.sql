CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  `surname` varchar(70) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login` datetime,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `signalements` (
  `id_signalement` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `tracking_code` varchar(255) UNIQUE NOT NULL COMMENT 'Code unique haute entropie',
  `tracking_password_hash` varchar(255) NOT NULL COMMENT 'Mot de passe secondaire du dossier',
  `victim_name_encrypted` varchar(255),
  `victim_contact_encrypted` varchar(255),
  `description_encrypted` text NOT NULL,
  `lieu_encrypted` varchar(255),
  `date_encrypted` datetime,
  `id_statut` int NOT NULL,
  `id_priorite` int NOT NULL,
  `id_categorie` int NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime
);

CREATE TABLE `statut` (
  `id_statut` int PRIMARY KEY AUTO_INCREMENT,
  `name_statut` varchar(30) NOT NULL
);

CREATE TABLE `priorite` (
  `id_priorite` int PRIMARY KEY AUTO_INCREMENT,
  `name_priorite` varchar(30) NOT NULL
);

CREATE TABLE `categorie` (
  `id_categorie` int PRIMARY KEY AUTO_INCREMENT,
  `name_categorie` varchar(30) NOT NULL
);

CREATE TABLE `role` (
  `id_role` int PRIMARY KEY AUTO_INCREMENT,
  `name_role` varchar(50) NOT NULL,
  `id_permission` int NOT NULL
);

CREATE TABLE `permission` (
  `id_permission` int PRIMARY KEY AUTO_INCREMENT,
  `name_role` varchar(70) NOT NULL
);

CREATE TABLE `pieces_jointes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_signalement` int NOT NULL,
  `encrypted_path` varchar(255) NOT NULL COMMENT 'Chemin S3/Local vers le fichier chiffré',
  `original_filename_encrypted` blob COMMENT 'Nom du fichier chiffré',
  `file_size` int,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `messages` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_signalement` int NOT NULL,
  `user_id` int COMMENT 'Null si c''''est le déposant anonyme',
  `contenu_encrypted` varchar(255) NOT NULL COMMENT 'Chiffré AES-256',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `audit_logs` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_signalement` int,
  `user_id` int,
  `action` varchar(255) NOT NULL,
  `details_encrypted` varchar(255),
  `ip_address` varchar(255),
  `previous_hash` varchar(255) NOT NULL COMMENT 'Lien cryptographique vers le log précédent',
  `current_hash` varchar(255) NOT NULL COMMENT 'Signature de la ligne actuelle',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `ia_classifications` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_signalement` int NOT NULL,
  `categorie_proposee_id` INT NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `signalements` ADD FOREIGN KEY (`id_statut`) REFERENCES `statut` (`id_statut`);

ALTER TABLE `signalements` ADD FOREIGN KEY (`id_priorite`) REFERENCES `priorite` (`id_priorite`);

ALTER TABLE `signalements` ADD FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`);

ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `role` (`id_role`);

ALTER TABLE `role` ADD FOREIGN KEY (`id_permission`) REFERENCES `permission` (`id_permission`);

ALTER TABLE `pieces_jointes` ADD FOREIGN KEY (`id_signalement`) REFERENCES `signalements` (`id_signalement`);

ALTER TABLE `messages` ADD FOREIGN KEY (`id_signalement`) REFERENCES `signalements` (`id_signalement`);

ALTER TABLE `messages` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `audit_logs` ADD FOREIGN KEY (`id_signalement`) REFERENCES `signalements` (`id_signalement`);

ALTER TABLE `audit_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `ia_classifications` ADD FOREIGN KEY (`id_signalement`) REFERENCES `signalements` (`id_signalement`);

ALTER TABLE `ia_classifications` ADD FOREIGN KEY (`categorie_proposee_id`) REFERENCES `categorie` (`id_categorie`);