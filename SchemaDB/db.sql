-- =======================================================
-- 1. TABLES INDÉPENDANTES (Pas de clés étrangères)
-- =======================================================

CREATE TABLE `role` (
  `id_role` INT AUTO_INCREMENT PRIMARY KEY,
  `name_role` VARCHAR(50) NOT NULL
);

CREATE TABLE `permission` (
  `id_permission` INT AUTO_INCREMENT PRIMARY KEY,
  `name_role` VARCHAR(70) NOT NULL
);

CREATE TABLE `statut` (
  `id_statut` INT AUTO_INCREMENT PRIMARY KEY,
  `name_statut` VARCHAR(30) NOT NULL
);

CREATE TABLE `priorite` (
  `id_priorite` INT AUTO_INCREMENT PRIMARY KEY,
  `name_priorite` VARCHAR(30) NOT NULL
);

CREATE TABLE `categorie` (
  `id_categorie` INT AUTO_INCREMENT PRIMARY KEY,
  `name_categorie` VARCHAR(30) NOT NULL
);

CREATE TABLE `log_files` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `path` VARCHAR(512) NOT NULL,
  `filename` BLOB NULL,
  `file_size` BIGINT NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =======================================================
-- 2. TABLES DÉPENDANTES (Niveau 1)
-- =======================================================

CREATE TABLE `role_permissions` (
  `id_role` INT NOT NULL,
  `id_permission` INT NOT NULL,
  PRIMARY KEY (`id_role`, `id_permission`),
  FOREIGN KEY (`id_role`) REFERENCES `role`(`id_role`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`id_permission`) REFERENCES `permission`(`id_permission`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(70) NOT NULL,
  `surname` VARCHAR(70) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  `is_active` TINYINT NOT NULL DEFAULT 1,
  `last_login` DATETIME(0) NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `role`(`id_role`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `signalements` (
  `id_signalement` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `tracking_code` VARCHAR(255) NOT NULL UNIQUE,
  `tracking_password_hash` VARCHAR(255) NOT NULL,
  `victim_name_encrypted` VARCHAR(255) NULL,
  `victim_contact_encrypted` VARCHAR(255) NULL,
  `description_encrypted` TEXT NOT NULL,
  `lieu_encrypted` VARCHAR(255) NULL,
  `date_encrypted` DATETIME(0) NULL,
  `id_statut` INT NOT NULL,
  `id_priorite` INT NOT NULL,
  `id_categorie` INT NOT NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME(0) NULL,
  FOREIGN KEY (`id_statut`) REFERENCES `statut`(`id_statut`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`id_priorite`) REFERENCES `priorite`(`id_priorite`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`id_categorie`) REFERENCES `categorie`(`id_categorie`) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- =======================================================
-- 3. TABLES DÉPENDANTES (Niveau 2)
-- =======================================================

CREATE TABLE `sessions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` VARCHAR(36) NULL,
  `session_token` VARCHAR(255) UNIQUE NULL,
  `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME(0) NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `pieces_jointes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_signalement` INT NOT NULL,
  `encrypted_path` VARCHAR(512) NOT NULL,
  `original_filename_encrypted` BLOB NULL,
  `file_size` BIGINT NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_id_signalement` (`id_signalement`),
  FOREIGN KEY (`id_signalement`) REFERENCES `signalements`(`id_signalement`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_signalement` INT NOT NULL,
  `user_id` VARCHAR(36) NULL,
  `contenu_encrypted` VARCHAR(255) NOT NULL,
  `is_read` TINYINT NOT NULL DEFAULT 0,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_signalement`) REFERENCES `signalements`(`id_signalement`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_signalement` INT NULL,
  `user_id` VARCHAR(36) NULL,
  `action` VARCHAR(255) NOT NULL,
  `details_encrypted` VARCHAR(255) NULL,
  `ip_address` VARCHAR(255) NULL,
  `previous_hash` VARCHAR(255) NOT NULL,
  `current_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_signalement`) REFERENCES `signalements`(`id_signalement`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `ia_classifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_signalement` INT NOT NULL,
  `categorie_proposee_id` INT NOT NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_signalement`) REFERENCES `signalements`(`id_signalement`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`categorie_proposee_id`) REFERENCES `categorie`(`id_categorie`) ON DELETE RESTRICT ON UPDATE CASCADE
);