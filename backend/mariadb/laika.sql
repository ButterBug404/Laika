-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mariadb
-- Tiempo de generación: 20-10-2025 a las 23:37:30
-- Versión del servidor: 12.0.2-MariaDB-ubu2404
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `laika`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adopters`
--

CREATE TABLE `adopters` (
  `user_id` int(11) NOT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `experience_with_pets` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adoptions`
--

CREATE TABLE `adoptions` (
  `id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `listed_by_user_id` int(11) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adoption_interest`
--

CREATE TABLE `adoption_interest` (
  `id` int(11) NOT NULL,
  `adopter_id` int(11) NOT NULL,
  `adoption_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `laika_users`
--

CREATE TABLE `laika_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `pat_name` varchar(100) NOT NULL,
  `mat_name` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `state` varchar(100) NOT NULL,
  `municipality` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `laika_users`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `missing_alerts`
--

CREATE TABLE `missing_alerts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `location` point NOT NULL,
  `circumstances` varchar(280) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pets`
--

CREATE TABLE `pets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `species` enum('DOG','CAT') NOT NULL,
  `breed` varchar(80) DEFAULT NULL,
  `color` varchar(60) NOT NULL,
  `age` tinyint(3) UNSIGNED NOT NULL,
  `sex` enum('MALE','FEMALE') NOT NULL,
  `size` enum('SMALL','MEDIUM','LARGE') NOT NULL,
  `markings` varchar(280) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adopters`
--
ALTER TABLE `adopters`
  ADD PRIMARY KEY (`user_id`);

--
-- Indices de la tabla `adoptions`
--
ALTER TABLE `adoptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_adoptions_pet_id` (`pet_id`),
  ADD KEY `fk_adoptions_user_id` (`listed_by_user_id`);

--
-- Indices de la tabla `adoption_interest`
--
ALTER TABLE `adoption_interest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_interest_adopter` (`adopter_id`),
  ADD KEY `fk_interest_adoption` (`adoption_id`);

--
-- Indices de la tabla `laika_users`
--
ALTER TABLE `laika_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_username` (`nombre`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Indices de la tabla `missing_alerts`
--
ALTER TABLE `missing_alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_missing_alerts_user_id` (`user_id`),
  ADD KEY `fk_missing_alerts_pet_id` (`pet_id`);

--
-- Indices de la tabla `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pets_user_id` (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adoptions`
--
ALTER TABLE `adoptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `adoption_interest`
--
ALTER TABLE `adoption_interest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `laika_users`
--
ALTER TABLE `laika_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `missing_alerts`
--
ALTER TABLE `missing_alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pets`
--
ALTER TABLE `pets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adopters`
--
ALTER TABLE `adopters`
  ADD CONSTRAINT `fk_adopters_user_id` FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `adoptions`
--
ALTER TABLE `adoptions`
  ADD CONSTRAINT `fk_adoptions_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_adoptions_user_id` FOREIGN KEY (`listed_by_user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `adoption_interest`
--
ALTER TABLE `adoption_interest`
  ADD CONSTRAINT `fk_interest_adopter` FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_interest_adoption` FOREIGN KEY (`adoption_id`) REFERENCES `adoptions` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `missing_alerts`
--
ALTER TABLE `missing_alerts`
  ADD CONSTRAINT `fk_missing_alerts_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_missing_alerts_user_id` FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `fk_pets_user_id` FOREIGN KEY (`user_id`) REFERENCES `laika_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
