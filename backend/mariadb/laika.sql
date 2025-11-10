-- ===========================================
-- Clean SQL Schema for "laika"
-- ===========================================

-- General setup
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
START TRANSACTION;

-- ===========================================
-- TABLE: laika_users
-- ===========================================
CREATE TABLE `laika_users` (
	`id` INT AUTO_INCREMENT PRIMARY KEY,
	`name` VARCHAR(100) NOT NULL,
	`pat_name` VARCHAR(100) NOT NULL,
	`mat_name` VARCHAR(100) NOT NULL,
	`email` VARCHAR(254) NOT NULL UNIQUE,
	`password_hash` VARCHAR(255) NOT NULL,
	`phone` VARCHAR(20) NOT NULL,
	`state` VARCHAR(100) NOT NULL,
	`municipality` VARCHAR(100) NOT NULL,
	`expo_push_token` VARCHAR(255) NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `laika_users` 
(`id`, `name`, `pat_name`, `mat_name`, `email`, `password_hash`, `phone`, `state`, `municipality`, `created_at`) VALUES
(1, 'David', 'Guevara', 'Martínez', 'user1@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$NvYtk8FkTpE06oCT1ZBSgQ$Vuy+abqanDL0m4GHkQg2HYQd3mjkYwr5kj9kDygci3w', '3312345678', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(2, 'Andrea', 'Lopez', 'Ramirez', 'user2@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$NKaCp7lHEgwni/8NI6PGxQ$eLTrUpVcIFCZYfXBFzZl7daGuLcDKCZJrFZlr6AUAZU', '3323456789', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(3, 'Carlos', 'Hernandez', 'Perez', 'user3@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$X9fEwoZEX9CYpNazlklxeA$0jSfHr8U9vypdnsBEEyUyPxg8LFTLmRQulWbPi2bQvU', '3334567890', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(4, 'Lucía', 'Mendoza', 'Ortega', 'user4@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$3/6ocJjPSETr5kwkC0gslw$2p7CfESftZY3+6oxcnpy2lCiz7p3F/8ZaNQp7O6tLQw', '3345678901', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(5, 'Fernando', 'Castro', 'Jimenez', 'user5@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$3GBP5txAIB8mVWzrL1SwxA$KMFg05UN+9yZnNpGocPOBubRncCemkfVwINPPtD1b30', '3356789012', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(6, 'Mariana', 'Ruiz', 'Vargas', 'user6@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$PIHsv5phpoocERY16H140w$1p8SDns/3yccjlIeTg6kagXCYDmm2tOIDxaLGn8Qj/Y', '3367890123', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(7, 'Jorge', 'Torres', 'Navarro', 'user7@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$iZ+pEUR0/9SbHs9mBPYkpw$X7Im5+xc3BvC9oD5wBhQYWPgWWcCdfmzzP1bDSAgQg4', '3378901234', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(8, 'Sofía', 'Reyes', 'Gonzalez', 'user8@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$YD2slOzMyJdw8q8UU1EIxg$CP5x4lDkQfbNfKqWgUynj+lCuzWfQvjgbNrPE1vDLw4', '3389012345', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:15'),
(9, 'Miguel', 'Flores', 'Ramirez', 'user9@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$eG9Z9t3WIQXAemRc9I9qiQ$8PyifmQm3sZcEc8WQivZ0p5VRwANWImHrPM3YQ6nkfk', '3390123456', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:15'),
(10, 'Laura', 'Sanchez', 'Moreno', 'user10@woofmail.com', '$argon2id$v=19$m=65536,t=3,p=4$j/kyEnhW7kfQFubtfpLP2w$zpIiCb1Kq5DAocJ/Rh+H/RkpcxE60+5G5ueJfauGuew', '3391234567', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:15');

-- ===========================================
-- TABLE: pets
-- ===========================================
CREATE TABLE pets (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	name VARCHAR(100),
	age INT,
	age_unit ENUM('MONTHS', 'YEARS') DEFAULT 'YEARS',
	breed VARCHAR(100),
	species ENUM('DOG', 'CAT', 'BIRD', 'BUNNY') NOT NULL DEFAULT 'DOG',
	vaccinated BOOLEAN DEFAULT FALSE,
	color VARCHAR(50),
	size ENUM('SMALL', 'MEDIUM', 'BIG') DEFAULT 'MEDIUM',
	sex ENUM('MALE', 'FEMALE', 'UNKNOWN') DEFAULT 'UNKNOWN',
	description TEXT,
	skin_condition BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES laika_users(id) ON DELETE CASCADE
);

INSERT INTO `pets` (`user_id`, `name`, `species`, `breed`, `color`, `age`, `age_unit`, `sex`, `size`, `vaccinated`, `description`, `skin_condition`) VALUES
(1, 'Firulais', 'DOG', 'Beagle', 'Tricolor', 4, 'YEARS', 'MALE', 'MEDIUM', TRUE, 'Perro beagle amigable y juguetón, le encanta buscar la pelota', FALSE),
(2, 'Pelusa', 'CAT', 'Persian', 'Blanco', 3, 'YEARS', 'FEMALE', 'SMALL', TRUE, 'Gata persa tranquila con hermoso pelaje esponjoso', FALSE),
(3, 'Pancho', 'DOG', 'Labrador', 'Negro', 5, 'YEARS', 'MALE', 'BIG', TRUE, 'Labrador leal y negro, excelente con niños', FALSE),
(4, 'Lupe', 'CAT', 'Siamese', 'Crema', 2, 'YEARS', 'FEMALE', 'SMALL', TRUE, 'Gata siamesa vocal y cariñosa con impresionantes ojos azules', FALSE),
(5, 'Güero', 'DOG', 'Poodle', 'Blanco', 6, 'YEARS', 'MALE', 'MEDIUM', TRUE, 'Poodle bien entrenado con pelaje rizado hipoalergénico', FALSE),
(6, 'Frida', 'CAT', 'Maine Coon', 'Café Atigrado', 3, 'YEARS', 'FEMALE', 'BIG', TRUE, 'Gata Maine Coon gigante gentil, muy sociable', FALSE),
(7, 'Chato', 'DOG', 'Boxer', 'Café Claro', 4, 'YEARS', 'MALE', 'BIG', TRUE, 'Boxer atlético con mucha energía', FALSE),
(8, 'Michi', 'CAT', 'British Shorthair', 'Gris', 1, 'YEARS', 'MALE', 'MEDIUM', TRUE, 'Gato British Shorthair tranquilo con facciones redondas', FALSE),
(9, 'Chiquita', 'DOG', 'Chihuahua', 'Café', 2, 'YEARS', 'FEMALE', 'SMALL', TRUE, 'Chihuahua pequeña pero valiente, muy alerta', FALSE),
(10, 'Bigotes', 'CAT', 'Abyssinian', 'Rojizo', 3, 'YEARS', 'MALE', 'MEDIUM', TRUE, 'Gato abisinio activo y juguetón con pelaje moteado', FALSE),
(1, 'Canela', 'DOG', 'Golden Retriever', 'Dorado', 5, 'YEARS', 'FEMALE', 'BIG', TRUE, 'Golden retriever dulce, excelente mascota familiar', FALSE),
(2, 'Simón', 'CAT', 'Ragdoll', 'Seal Point', 2, 'YEARS', 'MALE', 'BIG', TRUE, 'Gato ragdoll dócil que se relaja cuando lo cargas', FALSE),
(3, 'Toño', 'DOG', 'Shih Tzu', 'Blanco y Café', 4, 'YEARS', 'MALE', 'SMALL', TRUE, 'Shih Tzu amigable, le encanta la atención', FALSE),
(4, 'Cleo', 'CAT', 'Bengal', 'Manchado', 3, 'YEARS', 'FEMALE', 'MEDIUM', TRUE, 'Gata bengalí energética con patrón de pelaje salvaje', FALSE),
(5, 'Lobo', 'DOG', 'Doberman', 'Negro y Café', 5, 'YEARS', 'MALE', 'BIG', TRUE, 'Doberman protector e inteligente', FALSE),
(6, 'Blanquita', 'CAT', 'Sphynx', 'Rosa', 2, 'YEARS', 'FEMALE', 'SMALL', TRUE, 'Gata sin pelo cariñosa, necesita protección solar', TRUE),
(7, 'Salchicha', 'DOG', 'Dachshund', 'Café', 6, 'YEARS', 'MALE', 'SMALL', TRUE, 'Dachshund curioso con cuerpo largo y patas cortas', FALSE),
(8, 'Negrita', 'CAT', 'Oriental', 'Negro', 1, 'YEARS', 'FEMALE', 'SMALL', TRUE, 'Gata oriental elegante con orejas grandes', FALSE),
(9, 'Husky', 'DOG', 'Husky', 'Gris y Blanco', 3, 'YEARS', 'MALE', 'BIG', TRUE, 'Hermoso husky con impresionantes ojos azules', FALSE),
(10, 'Gris', 'CAT', 'Russian Blue', 'Gris', 4, 'YEARS', 'FEMALE', 'MEDIUM', TRUE, 'Elegante gato azul ruso con pelaje plateado aterciopelado', FALSE),
(1, 'Piolín', 'BIRD', 'Canary', 'Amarillo', 2, 'YEARS', 'MALE', 'SMALL', TRUE, 'Hermoso canario con voz melodiosa', FALSE),
(2, 'Pepe', 'BIRD', 'Parakeet', 'Verde y Amarillo', 1, 'YEARS', 'FEMALE', 'SMALL', TRUE, 'Periquita juguetona que ama cantar e interactuar', FALSE),
(3, 'Copito', 'BUNNY', 'Holland Lop', 'Blanco', 1, 'YEARS', 'MALE', 'SMALL', TRUE, 'Adorable conejo de orejas caídas con pelo suave y esponjoso', FALSE),
(4, 'Tambor', 'BUNNY', 'Flemish Giant', 'Gris', 2, 'YEARS', 'MALE', 'BIG', TRUE, 'Conejo gigante gentil, muy tranquilo y amigable', FALSE),
(5, 'Paco', 'BIRD', 'Cockatiel', 'Gris y Naranja', 3, 'YEARS', 'MALE', 'SMALL', TRUE, 'Cacatúa social que silba y le encantan las caricias en la cabeza', FALSE),
(6, 'Bolita', 'BUNNY', 'Lionhead', 'Blanco', 1, 'YEARS', 'FEMALE', 'SMALL', TRUE, 'Conejita lionhead esponjosa con adorable melena', FALSE);

-- ===========================================
-- TABLE: adoptions
-- ===========================================
CREATE TABLE `adoptions` (
	`id` INT AUTO_INCREMENT PRIMARY KEY,
	`pet_id` INT NOT NULL,
	`listed_by_user_id` INT NOT NULL,
	`description` VARCHAR(500),
	`contact_info` VARCHAR(100) NOT NULL,
	`contact_method` ENUM('EMAIL','WHATSAPP','BOTH') DEFAULT 'EMAIL',
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `fk_adoptions_pet_id` FOREIGN KEY (`pet_id`)
	REFERENCES `pets` (`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_adoptions_user_id` FOREIGN KEY (`listed_by_user_id`)
	REFERENCES `laika_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `adoptions` (`pet_id`, `listed_by_user_id`, `description`, `contact_info`) VALUES
(5, 5, 'Güero es un perro familiar maravilloso. Nos mudamos al extranjero y tristemente no podemos llevarlo. Completamente entrenado y excelente con niños.', '3356789012'),
(6, 6, 'Frida necesita un hogar con espacio para moverse. Es muy amigable y le encanta la atención. Perfecta para familias.', '3367890123'),
(8, 8, 'Michi es un gato tranquilo de interior. Busco alguien que pueda darle el amor y cuidado que merece.', '3389012345'),
(12, 2, 'Simón es el gato perfecto para tu regazo. Muy gentil y le encanta acurrucarse. Ideal para departamento.', '3323456789'),
(14, 4, 'Cleo es una gata activa que necesita espacio para jugar. Le iría mejor en un hogar sin otras mascotas.', '3345678901'),
(22, 2, 'Pepe es una periquita amigable buscando un hogar amoroso. Viene con jaula y juguetes.', '3323456789'),
(24, 4, 'Tambor es un conejo gigante gentil. Excelente con niños y muy cariñoso.', '3345678901');



-- ===========================================
-- TABLE: pet_alerts
-- ===========================================

CREATE TABLE `pet_alerts` (
	`id` INT AUTO_INCREMENT PRIMARY KEY,
	`user_id` INT NOT NULL,
	`pet_id` INT NOT NULL,
	`status` ENUM('MISSING', 'FOUND') NOT NULL DEFAULT 'MISSING',
	`time` TEXT,
	`last_seen_location` POINT NOT NULL,
	`description` VARCHAR(500),
	`contact_info` VARCHAR(100),
	`contact_method` ENUM('EMAIL','WHATSAPP','BOTH') DEFAULT 'EMAIL',
	`has_reward` BOOLEAN NOT NULL DEFAULT FALSE,
	`reward_description` VARCHAR(280),
	`reward_amount` DECIMAL(10,2),
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `laika_users`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`pet_id`) REFERENCES `pets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pet_alerts` (`user_id`, `pet_id`, `status`, `time`, `last_seen_location`, `description`, `contact_info`, `contact_method`, `has_reward`, `reward_description`, `reward_amount`) VALUES
(5, 15, 'MISSING', 'Hace 2 dias en la tarde', ST_GeomFromText('POINT(20.636430696361757 -103.25490178965572)'), 'Lobo se perdió durante nuestro paseo de la tarde. Lleva un collar rojo con placas. Es muy amigable pero puede estar asustado.', '3356789012', 'BOTH', TRUE, 'Recompensa en efectivo por regresarlo sano y salvo', 2000.00),
(8, 18, 'MISSING', 'Ayer en la mañana', ST_GeomFromText('POINT(20.636430696361757 -103.25490178965572)'), 'Negrita se escapó por una ventana abierta. Es tímida con extraños. Por favor manejarla con cuidado si la encuentran.', '3389012345', 'WHATSAPP', TRUE, 'Ofresco recompensa', 1000.00);





CREATE TABLE `pet_matches` (
	`id` INT AUTO_INCREMENT PRIMARY KEY,
	`missing_pet_alert_id` INT NOT NULL,
	`found_pet_alert_id` INT NOT NULL,
	`confidence_level` FLOAT NOT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`missing_pet_alert_id`) REFERENCES `pet_alerts`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`found_pet_alert_id`) REFERENCES `pet_alerts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
