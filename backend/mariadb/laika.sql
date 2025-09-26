-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mariadb
-- Tiempo de generación: 22-09-2025 a las 22:30:48
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
  `username` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  `state` varchar(100) NOT NULL,
  `municipality` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `laika_users`
--

INSERT INTO `laika_users` (`id`, `username`, `password_hash`, `email`, `state`, `municipality`, `created_at`) VALUES
(1, 'user_1', '$argon2id$v=19$m=65536,t=3,p=4$NvYtk8FkTpE06oCT1ZBSgQ$Vuy+abqanDL0m4GHkQg2HYQd3mjkYwr5kj9kDygci3w', 'user1@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(2, 'user_2', '$argon2id$v=19$m=65536,t=3,p=4$NKaCp7lHEgwni/8NI6PGxQ$eLTrUpVcIFCZYfXBFzZl7daGuLcDKCZJrFZlr6AUAZU', 'user2@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(3, 'user_3', '$argon2id$v=19$m=65536,t=3,p=4$X9fEwoZEX9CYpNazlklxeA$0jSfHr8U9vypdnsBEEyUyPxg8LFTLmRQulWbPi2bQvU', 'user3@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(4, 'user_4', '$argon2id$v=19$m=65536,t=3,p=4$3/6ocJjPSETr5kwkC0gslw$2p7CfESftZY3+6oxcnpy2lCiz7p3F/8ZaNQp7O6tLQw', 'user4@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(5, 'user_5', '$argon2id$v=19$m=65536,t=3,p=4$3GBP5txAIB8mVWzrL1SwxA$KMFg05UN+9yZnNpGocPOBubRncCemkfVwINPPtD1b30', 'user5@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(6, 'user_6', '$argon2id$v=19$m=65536,t=3,p=4$PIHsv5phpoocERY16H140w$1p8SDns/3yccjlIeTg6kagXCYDmm2tOIDxaLGn8Qj/Y', 'user6@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(7, 'user_7', '$argon2id$v=19$m=65536,t=3,p=4$iZ+pEUR0/9SbHs9mBPYkpw$X7Im5+xc3BvC9oD5wBhQYWPgWWcCdfmzzP1bDSAgQg4', 'user7@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:14'),
(8, 'user_8', '$argon2id$v=19$m=65536,t=3,p=4$YD2slOzMyJdw8q8UU1EIxg$CP5x4lDkQfbNfKqWgUynj+lCuzWfQvjgbNrPE1vDLw4', 'user8@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:15'),
(9, 'user_9', '$argon2id$v=19$m=65536,t=3,p=4$eG9Z9t3WIQXAemRc9I9qiQ$8PyifmQm3sZcEc8WQivZ0p5VRwANWImHrPM3YQ6nkfk', 'user9@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:15'),
(10, 'user_10', '$argon2id$v=19$m=65536,t=3,p=4$j/kyEnhW7kfQFubtfpLP2w$zpIiCb1Kq5DAocJ/Rh+H/RkpcxE60+5G5ueJfauGuew', 'user10@woofmail.com', 'Jalisco', 'Guadalajara', '2025-08-27 03:29:15');

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
  ADD UNIQUE KEY `unique_username` (`username`),
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
