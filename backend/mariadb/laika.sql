SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `laika_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL, -- changed from CHAR(60)
  `email` VARCHAR(254) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`username`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(80) NOT NULL,
  `species` ENUM('DOG','CAT') NOT NULL,
  `breed` VARCHAR(80),
  `color` VARCHAR(60) NOT NULL,
  `age` TINYINT UNSIGNED NOT NULL, -- pets won’t be 300yo
  `sex` ENUM('MALE','FEMALE') NOT NULL,
  `size` ENUM('SMALL','MEDIUM','LARGE') NOT NULL,
  `markings` VARCHAR(280) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pets_user_id` (`user_id`),
  CONSTRAINT `fk_pets_user_id` FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `missing_alerts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `pet_id` INT NOT NULL,
  `time` DATETIME NOT NULL,
  `location` POINT NOT NULL,
  `circumstances` VARCHAR(280) NOT NULL, -- typo fixed
  PRIMARY KEY (`id`),
  KEY `fk_missing_alerts_user_id` (`user_id`),
  KEY `fk_missing_alerts_pet_id` (`pet_id`),
  CONSTRAINT `fk_missing_alerts_user_id` FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_missing_alerts_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `adoptions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pet_id` INT NOT NULL,
  `listed_by_user_id` INT NOT NULL,
  `description` VARCHAR(500),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_adoptions_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_adoptions_user_id` FOREIGN KEY (`listed_by_user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `adopters` (
  `user_id` INT NOT NULL,
  `bio` VARCHAR(500),
  `experience_with_pets` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_adopters_user_id` FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `adoption_interest` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `adopter_id` INT NOT NULL,
  `adoption_id` INT NOT NULL,
  `message` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_interest_adopter` FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_interest_adoption` FOREIGN KEY (`adoption_id`) REFERENCES `adoptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

