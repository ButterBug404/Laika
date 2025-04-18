SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `laika_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(150) NOT NULL,
  `password_hash` char(60) NOT NULL,
  `email` varchar(254) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `pets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `species` enum('DOG','CAT') NOT NULL,
  `breed` varchar(80) DEFAULT NULL,
  `color` varchar(60) NOT NULL,
  `age` int(11) NOT NULL,
  `sex` enum('MALE','FEMALE') NOT NULL,
  `size` enum('SMALL','MEDIUM','LARGE') NOT NULL,
  `markings` varchar(280) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pets_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `missing_alerts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `location` point NOT NULL,
  `circumstancias` varchar(280) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_missing_alerts_user_id` (`user_id`),
  KEY `fk_missing_alerts_pet_id` (`pet_id`),
  FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `adoptions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pet_id` INT NOT NULL,
  `listed_by_user_id` INT NOT NULL,
  `description` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`listed_by_user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `adopters` (
  `user_id` INT NOT NULL,
  `bio` VARCHAR(500),
  `experience_with_pets` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `adoption_interest` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `adopter_id` INT NOT NULL,
  `adoption_id` INT NOT NULL,
  `message` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`adoption_id`) REFERENCES `adoptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

COMMIT;

